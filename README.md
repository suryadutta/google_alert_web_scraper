# google_alert_web_scraper
Scrape alerts from Google Alert

This code requires the use of four environmental variables for authentication:

* EMAIL_ADDRESS
* EMAIL_PASSWORD
* MONGO_USER
* MONGO_PASS

For test purposes, you should create an .env file with your credentials stored like this:

EMAIL_ADDRESS=<Your Google Email Address>
EMAIL_PASSWORD=<Your Google Account Password>
MONGO_USER=<Your MongoDB username>
MONGO_PASS=<Your MongoDB password>

Production instances should also have these environmental variables set up before running.
