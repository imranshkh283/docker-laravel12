# PHP 8.2 FPM
FROM php:8.2-fpm

# System dependencies
RUN apt-get update \
    && apt-get install -y \
        git \
        curl \
        libpng-dev \
        libonig-dev \
        libxml2-dev \
        libpq-dev \
        zip \
        unzip \
    && rm -rf /var/lib/apt/lists/*

# PHP extensions
RUN docker-php-ext-configure gd \
    && docker-php-ext-install -j"$(nproc)" \
        pdo_pgsql \
        mbstring \
        exif \
        pcntl \
        bcmath \
        gd

# Redis PHP extension
RUN pecl install redis \
    && docker-php-ext-enable redis

# Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Working directory
WORKDIR /var/www

# Create Laravel user
RUN useradd \
        --groups www-data \
        --uid 1000 \
        --create-home \
        --home-dir /home/dev \
        dev

# Laravel storage and cache permissions
RUN mkdir -p \
        /var/www/storage \
        /var/www/bootstrap/cache \
    && chown -R dev:www-data /var/www \
    && chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# Run as Laravel user
USER dev

# Start PHP-FPM
CMD ["php-fpm"]
