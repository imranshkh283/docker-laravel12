# PHP 8.2 FPM
FROM php:8.2-fpm

# System dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# PHP extensions
RUN docker-php-ext-install \
    pdo_mysql \
    mbstring \
    exif \
    pcntl \
    bcmath \
    gd

# Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Working directory
WORKDIR /var/www

# Create Laravel user
RUN useradd -G www-data -u 1000 -d /home/dev -m dev

# Laravel storage/cache permissions
RUN mkdir -p \
    /var/www/storage \
    /var/www/bootstrap/cache \
    && chown -R dev:www-data /var/www \
    && chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# Run as Laravel user
USER dev

CMD ["php-fpm"]
