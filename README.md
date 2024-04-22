### ParrotPB - A WordPress Alternative for Blogging

ParrotPB is an open-source blogging platform designed as a WordPress alternative, using PocketBase as a backend. It is built with SvelteKit and Skeleton UI, providing a fast and responsive user interface. It is currently used by [www.ktechs.xyz](http://www.ktechs.xyz) and offers a variety of features for scientists, students, bloggers, tutors, and anyone looking for a versatile and dynamic blogging solution.

### Key Features

- Dynamic main menus, submenus, and sub-menu lists
- SEO-optimized for better search engine visibility
- Gemini support (for now)
- Renders diagrams using MermaidJS(client side)
- Supports mathematical expressions and calculations using Katex(both server side and client side)
- Uses StackEditJS for easy and intuitive content editing
- Built with SvelteKit and Skeleton UI for a fast and responsive experience
- Ability to blog about YouTube videos using Gemini to summarize the content

## Demo & Test Account

To check out ParrotPB in action, head to [writube.vercel.app](https://writube.vercel.app) and use the following credentials:

- Username: tester
- Password: tester

## Hosting & Setup

Frontend hosting is free on [Vercel.com](http://vercel.com), while backend hosting can be done on [Pockethost.io](http://pockethost.io). To initialize the database, copy the provided JSON schema and paste it on import schema.

To set up the frontend:

1. Head to [Vercel](http://vercel.com) and create a new project.
2. Import the ParrotPB repository from GitHub using this URL: `https://github.com/deniskipeles/parrotPB.git`
3. Add the following environmental variables:
	* `PUBLIC_PALM_KEY` leave it as empty string if you are not going to use gemini
	* `PUBLIC_POCKETBASE_URL`
4. Deploy the project.

Your blogging page is now ready to use!

## JSON Schema

Here's a pocketbase JSON schema to get you started:

```json
[
    {
        "id": "mgo47xb7czf2v2p",
        "name": "clients",
        "type": "auth",
        "system": false,
        "schema": [
            {
                "system": false,
                "id": "3qtpkac4",
                "name": "name",
                "type": "text",
                "required": false,
                "presentable": false,
                "unique": false,
                "options": {
                    "min": null,
                    "max": null,
                    "pattern": ""
                }
            }
        ],
        "indexes": [],
        "listRule": "id = @request.auth.id",
        "viewRule": "id = @request.auth.id",
        "createRule": "",
        "updateRule": "id = @request.auth.id",
        "deleteRule": "id = @request.auth.id",
        "options": {
            "allowEmailAuth": true,
            "allowOAuth2Auth": true,
            "allowUsernameAuth": true,
            "exceptEmailDomains": null,
            "manageRule": null,
            "minPasswordLength": 5,
            "onlyEmailDomains": null,
            "onlyVerified": false,
            "requireEmail": false
        }
    },
    {
        "id": "_pb_users_auth_",
        "name": "developers",
        "type": "auth",
        "system": false,
        "schema": [
            {
                "system": false,
                "id": "users_name",
                "name": "name",
                "type": "text",
                "required": false,
                "presentable": false,
                "unique": false,
                "options": {
                    "min": null,
                    "max": null,
                    "pattern": ""
                }
            },
            {
                "system": false,
                "id": "users_avatar",
                "name": "avatar",
                "type": "file",
                "required": false,
                "presentable": false,
                "unique": false,
                "options": {
                    "mimeTypes": [
                        "image/jpeg",
                        "image/png",
                        "image/svg+xml",
                        "image/gif",
                        "image/webp"
                    ],
                    "thumbs": null,
                    "maxSelect": 1,
                    "maxSize": 5242880,
                    "protected": false
                }
            }
        ],
        "indexes": [],
        "listRule": "",
        "viewRule": "",
        "createRule": "",
        "updateRule": "id = @request.auth.id",
        "deleteRule": "id = @request.auth.id",
        "options": {
            "allowEmailAuth": true,
            "allowOAuth2Auth": true,
            "allowUsernameAuth": true,
            "exceptEmailDomains": null,
            "manageRule": null,
            "minPasswordLength": 5,
            "onlyEmailDomains": null,
            "onlyVerified": false,
            "requireEmail": false
        }
    },
    {
        "id": "2rjsm8xe5tlz8g9",
        "name": "articles",
        "type": "base",
        "system": false,
        "schema": [
            {
                "system": false,
                "id": "yd7y40ak",
                "name": "title",
                "type": "text",
                "required": false,
                "presentable": false,
                "unique": false,
                "options": {
                    "min": null,
                    "max": null,
                    "pattern": ""
                }
            },
            {
                "system": false,
                "id": "rnjtbrnv",
                "name": "images",
                "type": "file",
                "required": false,
                "presentable": false,
                "unique": false,
                "options": {
                    "mimeTypes": [],
                    "thumbs": [
                        "200x0"
                    ],
                    "maxSelect": 99,
                    "maxSize": 5242880,
                    "protected": false
                }
            },
            {
                "system": false,
                "id": "cottvnvy",
                "name": "content",
                "type": "editor",
                "required": false,
                "presentable": false,
                "unique": false,
                "options": {
                    "convertUrls": false
                }
            },
            {
                "system": false,
                "id": "phbreroy",
                "name": "cover_image",
                "type": "file",
                "required": false,
                "presentable": false,
                "unique": false,
                "options": {
                    "mimeTypes": [
                        "image/png",
                        "image/vnd.adobe.photoshop",
                        "image/vnd.mozilla.apng",
                        "image/jpeg",
                        "image/jxl",
                        "image/gif",
                        "image/webp",
                        "image/tiff",
                        "image/bmp",
                        "image/x-icon"
                    ],
                    "thumbs": [
                        "720x480",
                        "512x256"
                    ],
                    "maxSelect": 1,
                    "maxSize": 5242880,
                    "protected": false
                }
            },
            {
                "system": false,
                "id": "3v2pazma",
                "name": "tags",
                "type": "json",
                "required": false,
                "presentable": false,
                "unique": false,
                "options": {
                    "maxSize": 2000000
                }
            },
            {
                "system": false,
                "id": "yfth6v7o",
                "name": "developer_id",
                "type": "relation",
                "required": true,
                "presentable": false,
                "unique": false,
                "options": {
                    "collectionId": "_pb_users_auth_",
                    "cascadeDelete": false,
                    "minSelect": null,
                    "maxSelect": 1,
                    "displayFields": null
                }
            },
            {
                "system": false,
                "id": "sue6yiju",
                "name": "excerpt",
                "type": "text",
                "required": false,
                "presentable": false,
                "unique": false,
                "options": {
                    "min": 10,
                    "max": 200,
                    "pattern": ""
                }
            },
            {
                "system": false,
                "id": "uzlibmnp",
                "name": "url",
                "type": "url",
                "required": false,
                "presentable": false,
                "unique": false,
                "options": {
                    "exceptDomains": null,
                    "onlyDomains": null
                }
            },
            {
                "system": false,
                "id": "tldtutnh",
                "name": "sub_menu_list_id",
                "type": "relation",
                "required": false,
                "presentable": false,
                "unique": false,
                "options": {
                    "collectionId": "wqwifpbl1h6g432",
                    "cascadeDelete": false,
                    "minSelect": null,
                    "maxSelect": 1,
                    "displayFields": null
                }
            },
            {
                "system": false,
                "id": "um2aef1n",
                "name": "premium_content",
                "type": "bool",
                "required": false,
                "presentable": false,
                "unique": false,
                "options": {}
            }
        ],
        "indexes": [],
        "listRule": "premium_content = false ||\n(\n  premium_subscriptions_via_articles_ids.client_id ?~ @request.auth.id &&\n  premium_subscriptions_via_articles_ids.expiration_date < @todayEnd\n)",
        "viewRule": "",
        "createRule": "@request.auth.id != ''",
        "updateRule": "developer_id = @request.auth.id ||\n@request.auth.id = developer_id",
        "deleteRule": "developer_id = @request.auth.id ||\n@request.auth.id = developer_id",
        "options": {}
    },
    {
        "id": "532fhf9r39w6o8d",
        "name": "main_menu",
        "type": "base",
        "system": false,
        "schema": [
            {
                "system": false,
                "id": "hgmd0yep",
                "name": "label",
                "type": "text",
                "required": true,
                "presentable": true,
                "unique": false,
                "options": {
                    "min": null,
                    "max": 50,
                    "pattern": ""
                }
            },
            {
                "system": false,
                "id": "i03hzfll",
                "name": "description",
                "type": "text",
                "required": false,
                "presentable": false,
                "unique": false,
                "options": {
                    "min": null,
                    "max": null,
                    "pattern": ""
                }
            },
            {
                "system": false,
                "id": "ntsigf0g",
                "name": "icon_font_awesome",
                "type": "text",
                "required": false,
                "presentable": false,
                "unique": false,
                "options": {
                    "min": 0,
                    "max": null,
                    "pattern": ""
                }
            },
            {
                "system": false,
                "id": "d7sp5kmo",
                "name": "icon_image",
                "type": "file",
                "required": false,
                "presentable": false,
                "unique": false,
                "options": {
                    "mimeTypes": [],
                    "thumbs": [],
                    "maxSelect": 1,
                    "maxSize": 5242880,
                    "protected": false
                }
            }
        ],
        "indexes": [
            "CREATE UNIQUE INDEX `idx_OXhDNvp` ON `main_menu` (`label`)"
        ],
        "listRule": "",
        "viewRule": "",
        "createRule": " @request.auth.id ?= @collection.developers.id",
        "updateRule": null,
        "deleteRule": null,
        "options": {}
    },
    {
        "id": "fcubzfqu0max1g8",
        "name": "premium_subscriptions",
        "type": "base",
        "system": false,
        "schema": [
            {
                "system": false,
                "id": "5eixkusm",
                "name": "client_id",
                "type": "relation",
                "required": true,
                "presentable": false,
                "unique": false,
                "options": {
                    "collectionId": "mgo47xb7czf2v2p",
                    "cascadeDelete": true,
                    "minSelect": null,
                    "maxSelect": 1,
                    "displayFields": null
                }
            },
            {
                "system": false,
                "id": "cb6cxvf4",
                "name": "articles_ids",
                "type": "relation",
                "required": true,
                "presentable": false,
                "unique": false,
                "options": {
                    "collectionId": "2rjsm8xe5tlz8g9",
                    "cascadeDelete": true,
                    "minSelect": null,
                    "maxSelect": null,
                    "displayFields": null
                }
            },
            {
                "system": false,
                "id": "okynwoo4",
                "name": "expiration_date",
                "type": "date",
                "required": true,
                "presentable": true,
                "unique": false,
                "options": {
                    "min": "",
                    "max": ""
                }
            }
        ],
        "indexes": [],
        "listRule": null,
        "viewRule": null,
        "createRule": null,
        "updateRule": null,
        "deleteRule": null,
        "options": {}
    },
    {
        "id": "6dzdzkzwca9nws9",
        "name": "root",
        "type": "base",
        "system": false,
        "schema": [
            {
                "system": false,
                "id": "ystigdco",
                "name": "name",
                "type": "text",
                "required": false,
                "presentable": false,
                "unique": false,
                "options": {
                    "min": null,
                    "max": null,
                    "pattern": ""
                }
            },
            {
                "system": false,
                "id": "gba8se0b",
                "name": "data",
                "type": "json",
                "required": false,
                "presentable": false,
                "unique": false,
                "options": {
                    "maxSize": 2000000
                }
            },
            {
                "system": false,
                "id": "7fajtjtb",
                "name": "html_data",
                "type": "editor",
                "required": false,
                "presentable": false,
                "unique": false,
                "options": {
                    "convertUrls": false
                }
            }
        ],
        "indexes": [
            "CREATE UNIQUE INDEX `idx_FDv18Uw` ON `root` (`name`)"
        ],
        "listRule": "",
        "viewRule": "",
        "createRule": null,
        "updateRule": null,
        "deleteRule": null,
        "options": {}
    },
    {
        "id": "udt3w74ufstlirh",
        "name": "sub_menu",
        "type": "base",
        "system": false,
        "schema": [
            {
                "system": false,
                "id": "jg5y8th1",
                "name": "label",
                "type": "text",
                "required": true,
                "presentable": true,
                "unique": false,
                "options": {
                    "min": null,
                    "max": 50,
                    "pattern": ""
                }
            },
            {
                "system": false,
                "id": "tp0sfeaa",
                "name": "main_menu_id",
                "type": "relation",
                "required": true,
                "presentable": false,
                "unique": false,
                "options": {
                    "collectionId": "532fhf9r39w6o8d",
                    "cascadeDelete": true,
                    "minSelect": null,
                    "maxSelect": 1,
                    "displayFields": null
                }
            },
            {
                "system": false,
                "id": "kwiq1k5e",
                "name": "description",
                "type": "text",
                "required": false,
                "presentable": false,
                "unique": false,
                "options": {
                    "min": null,
                    "max": null,
                    "pattern": ""
                }
            }
        ],
        "indexes": [],
        "listRule": "",
        "viewRule": "",
        "createRule": "@collection.developers.id ?~ @request.auth.id",
        "updateRule": null,
        "deleteRule": null,
        "options": {}
    },
    {
        "id": "wqwifpbl1h6g432",
        "name": "sub_menu_list",
        "type": "base",
        "system": false,
        "schema": [
            {
                "system": false,
                "id": "ws4dqjrb",
                "name": "label",
                "type": "text",
                "required": true,
                "presentable": true,
                "unique": false,
                "options": {
                    "min": null,
                    "max": 50,
                    "pattern": ""
                }
            },
            {
                "system": false,
                "id": "lxbqu5r0",
                "name": "sub_menu_id",
                "type": "relation",
                "required": true,
                "presentable": false,
                "unique": false,
                "options": {
                    "collectionId": "udt3w74ufstlirh",
                    "cascadeDelete": true,
                    "minSelect": null,
                    "maxSelect": 1,
                    "displayFields": null
                }
            },
            {
                "system": false,
                "id": "cjt4rso1",
                "name": "description",
                "type": "text",
                "required": false,
                "presentable": false,
                "unique": false,
                "options": {
                    "min": null,
                    "max": null,
                    "pattern": ""
                }
            },
            {
                "system": false,
                "id": "fddzpmvj",
                "name": "keywords",
                "type": "json",
                "required": false,
                "presentable": false,
                "unique": false,
                "options": {
                    "maxSize": 2000000
                }
            }
        ],
        "indexes": [],
        "listRule": "",
        "viewRule": "",
        "createRule": "@collection.developers.id ?~ @request.auth.id",
        "updateRule": null,
        "deleteRule": null,
        "options": {}
    },
    {
        "id": "eeesdky9oi1b7f6",
        "name": "view_articles_list",
        "type": "view",
        "system": false,
        "schema": [
            {
                "system": false,
                "id": "hu0daj43",
                "name": "cover_image",
                "type": "file",
                "required": false,
                "presentable": false,
                "unique": false,
                "options": {
                    "mimeTypes": [
                        "image/png",
                        "image/vnd.adobe.photoshop",
                        "image/vnd.mozilla.apng",
                        "image/jpeg",
                        "image/jxl",
                        "image/gif",
                        "image/webp",
                        "image/tiff",
                        "image/bmp",
                        "image/x-icon"
                    ],
                    "thumbs": [
                        "720x480",
                        "512x256"
                    ],
                    "maxSelect": 1,
                    "maxSize": 5242880,
                    "protected": false
                }
            },
            {
                "system": false,
                "id": "y5ezfpzf",
                "name": "excerpt",
                "type": "text",
                "required": false,
                "presentable": false,
                "unique": false,
                "options": {
                    "min": 10,
                    "max": 200,
                    "pattern": ""
                }
            },
            {
                "system": false,
                "id": "arhsw7bl",
                "name": "title",
                "type": "text",
                "required": false,
                "presentable": false,
                "unique": false,
                "options": {
                    "min": null,
                    "max": null,
                    "pattern": ""
                }
            },
            {
                "system": false,
                "id": "qrnz9krn",
                "name": "content",
                "type": "editor",
                "required": false,
                "presentable": false,
                "unique": false,
                "options": {
                    "convertUrls": false
                }
            },
            {
                "system": false,
                "id": "ua6ahrag",
                "name": "tags",
                "type": "json",
                "required": false,
                "presentable": false,
                "unique": false,
                "options": {
                    "maxSize": 2000000
                }
            },
            {
                "system": false,
                "id": "mwkspck8",
                "name": "url",
                "type": "url",
                "required": false,
                "presentable": false,
                "unique": false,
                "options": {
                    "exceptDomains": null,
                    "onlyDomains": null
                }
            }
        ],
        "indexes": [],
        "listRule": "",
        "viewRule": "",
        "createRule": null,
        "updateRule": null,
        "deleteRule": null,
        "options": {
            "query": "SELECT\n  articles.id,\n  articles.created,\n  articles.updated,\n  articles.cover_image,\n  articles.excerpt,\n  articles.title,\n  articles.content,\n  articles.tags,\n  articles.url\nFROM\n  articles;\n"
        }
    },
    {
        "id": "hitdzsgf4uodwna",
        "name": "view_tables",
        "type": "view",
        "system": false,
        "schema": [
            {
                "system": false,
                "id": "gwczxetv",
                "name": "name",
                "type": "json",
                "required": false,
                "presentable": false,
                "unique": false,
                "options": {
                    "maxSize": 1
                }
            },
            {
                "system": false,
                "id": "xow5323i",
                "name": "type",
                "type": "json",
                "required": false,
                "presentable": false,
                "unique": false,
                "options": {
                    "maxSize": 1
                }
            },
            {
                "system": false,
                "id": "4mtdfbnz",
                "name": "schema",
                "type": "json",
                "required": false,
                "presentable": false,
                "unique": false,
                "options": {
                    "maxSize": 1
                }
            }
        ],
        "indexes": [],
        "listRule": "",
        "viewRule": "",
        "createRule": null,
        "updateRule": null,
        "deleteRule": null,
        "options": {
            "query": "SELECT\n    id,\n    --system,\n    name,\n    type,\n    schema\n    --indexes,\n    --options,\n    --viewRule,\n    --listRule,\n    --createRule,\n    --updateRule,\n    --deleteRule,\n    --created,\n    --updated\nFROM\n    '_collections'\n"
        }
    }
]
```

Replace the content with your own schema and import it into PocketBase.

## Contributing

ParrotPB is an open-source project, and we welcome contributions from the community. If you'd like to contribute, please submit a pull request with your proposed changes or improvements.

## License

ParrotPB is released under the MIT License. See the [LICENSE](https://github.com/deniskipeles/parrotPB/blob/main/LICENSE) file for more information.

## Support

If you encounter any issues or have questions about ParrotPB, please open an issue on the [GitHub repository](https://github.com/deniskipeles/parrotPB/issues). I will be happy to help!

Happy blogging!