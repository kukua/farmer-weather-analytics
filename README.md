# Farmer Analytics

> Show forecast to farmers and allow them to provide us with feedback.

## Usage

```bash
git clone https://github.com/kukua/farmer-analytics.git
cd farmer-analytics/
cd www/
cp .env.sample .env
chmod 600 .env
# > Edit .env
cd ../
docker-compose up -d
docker-compose run --rm --entrypoint=composer lumen install
docker-compose run --rm --entrypoint=php lumen artisan migrate
sudo chown -R $USER:$USER .

# Update autoloader
docker-compose run --rm --entrypoint=composer lumen dumpautoload

# Test
docker-compose run --rm --entrypoint=php lumen ./vendor/bin/phpunit
```

## Upgrade

```bash
cd farmer-analytics/
git pull
docker-compose run --rm --entrypoint=composer lumen install
docker-compose run --rm --entrypoint=php lumen artisan migrate
```

## License

This software is licensed under the [MIT license](https://github.com/kukua/farmer-analytics/blob/master/LICENSE).

© 2016 Kukua BV
