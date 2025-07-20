import uvicorn
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from typing import Dict, List
import json
import requests
import os
from dotenv import load_dotenv

# Cargar variables del .enva
load_dotenv()

# Leer la URI desde el .env
MONGO_URI = os.getenv("MONGO_URI")

# Intentar conectar a MongoDB y verificar con ping
try:
    client = AsyncIOMotorClient(MONGO_URI)
    client.admin.command("ping")
    print("✅ Conexión a MongoDB exitosa")
except Exception as e:
    print(f"❌ Error al conectar a MongoDB: {e}")
    raise e  # Detener el arranque si no hay conexión

# Seleccionar la base de datos y colección
db = client["CatalogServiceDB"]
chats_collection = db["chats"]

# También puedes acceder a SECRET_KEY si lo necesitas
SECRET_KEY = os.getenv("SECRET_KEY")

# URL del servicio de búsqueda de usuarios (user-search-service)
USER_SEARCH_URL = "http://54.243.94.215:5016/user/soap"

app = FastAPI()

# Diccionario para manejar conexiones activas {chat_id: [websocket1, websocket2]}
active_chats: Dict[str, List[WebSocket]] = {}

async def get_chat_id(user1: str, user2: str) -> str:
    """ Devuelve el chat_id de una conversación entre user1 y user2 """
    users = sorted([user1, user2])  # Para que el ID sea consistentea
    return f"{users[0]}_{users[1]}"

def user_exists(username: str) -> bool:
    """ Verifica si un usuario existe consultando el servicio SOAP de búsqueda de usuarios """
    try:
        response = requests.get(USER_SEARCH_URL, params={"username": username})
        if response.status_code != 200 or "Usuario no encontrado" in response.text:
            return False
        return True
    except Exception as e:
        print(f"❌ Error al consultar user-search-service: {e}")
        return False

@app.websocket("/ws/{user1}/{user2}")
async def websocket_endpoint(websocket: WebSocket, user1: str, user2: str):
    # Verificar si los usuarios existen antes de crear el chat
    if not user_exists(user1):
        raise HTTPException(status_code=404, detail="El usuario1 no existe")

    if not user_exists(user2):
        raise HTTPException(status_code=404, detail="El usuario2 no existe")

    chat_id = await get_chat_id(user1, user2)
    
    # Aceptar la conexión WebSocket
    await websocket.accept()

    # Si no existe el chat, crear un nuevo chat vacío
    if chat_id not in active_chats:
        active_chats[chat_id] = []

    # Agregar la conexión WebSocket a la lista de conexiones activas
    active_chats[chat_id].append(websocket)

    # Recuperar mensajes anteriores correctamente
    previous_messages = await chats_collection.find_one({"chat_id": chat_id})
    if previous_messages:
        for message in previous_messages["messages"]:
            await websocket.send_json({"sender": message["sender"], "text": message["text"]})

    try:
        while True:
            data = await websocket.receive_text()
            message_json = json.loads(data)
            
            message = {"sender": message_json["sender"], "text": message_json["text"]}

            # Guardar en la base de datos
            await chats_collection.update_one(
                {"chat_id": chat_id},
                {"$push": {"messages": message}},
                upsert=True
            )

            # Enviar mensaje a todos los usuarios en el chat
            for connection in active_chats[chat_id]:
                if connection != websocket:
                    await connection.send_json(message)

    except WebSocketDisconnect:
        active_chats[chat_id].remove(websocket)
        if not active_chats[chat_id]:
            del active_chats[chat_id]
        await websocket.close()
    except Exception as e:
        print(f"Error en WebSocket: {e}")
        await websocket.close()

# Ejecutar el servidor
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5010)