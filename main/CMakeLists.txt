idf_component_register(SRCS 
                        "logs_to_web.c"
                        "main.c"
                        "set_up_wifi.c"
                        "websocket.c"
                    INCLUDE_DIRS ".")
spiffs_create_partition_image(storage ../web FLASH_IN_PROJECT)