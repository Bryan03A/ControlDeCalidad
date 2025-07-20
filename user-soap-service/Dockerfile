# Use Ruby 3.1 slim base image
FROM ruby:3.1-slim

# Install build tools and libraries needed to compile native extensions
RUN apt-get update && apt-get install -y build-essential libpq-dev

# Install Bundler version 2.6.3
RUN gem install bundler:2.6.3

# Set working directory
WORKDIR /app

# Copy Gemfile and Gemfile.lock to install gems
COPY Gemfile Gemfile.lock /app/

# Install required gems excluding development and test groups
RUN bundle install --without development test

# Copy the .env file
COPY .env /app/

# Copy application code
COPY . /app

# Expose port 5002 so the container is accessible
EXPOSE 5002

# Run the Ruby service when the container starts
CMD ["ruby", "service.rb"]