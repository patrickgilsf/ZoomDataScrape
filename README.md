# ZoomDataScrape

Working on an app that generates a file of offline rooms whenever it is run.

Please note that the .env file is missing, for security purposes. User must find ZG's API Key and API Secret, from the Zoom Marketplace section under 'Manage App'.

If you don't get the .env file from ZGAV, you need to create a file titled '.env' in the folder 'ZoomDataScrape', with the following format:

MYAPIKEY=<ZG's API Key>

MYAPISECRET=<ZG's API Secret>

note: keep in mind, there can be no spaces on either side of the =, neither should the <> be there when the key is added. 

Please make sure the following is DL'd as well:

- Node
- npm
- all packages listed in 'package.json' under 'dependencies'.
  