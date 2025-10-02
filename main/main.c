#include "logs_to_web.h"
#include "set_up_wifi.h"
#include "websocket.h"
#include "esp_log.h"

extern httpd_handle_t server;
static const char *TAG = "main"; // TAG for debug

static void init_nvs(void) {
    esp_err_t ret = nvs_flash_init();
    if (ret == ESP_ERR_NVS_NO_FREE_PAGES || ret == ESP_ERR_NVS_NEW_VERSION_FOUND)
    {
        ESP_ERROR_CHECK(nvs_flash_erase());
        ret = nvs_flash_init();
    }
    ESP_ERROR_CHECK(ret);
}

void app_main(void)
{
    init_nvs();
    wifi_init_softap(); // This example makes the ESP32 an Access Point, you may change it to station and connect to an AP instead if your application needs to
    ESP_LOGI(TAG, "ESP32 Access Point running...\n");
    initi_web_page_buffer();
#ifdef WS_DEBUG
    list_spiffs_files();
#endif
    setup_websocket_server();
    init_logging_system();
    while(1){
        ESP_LOGI(TAG, "This is a log!");
        ESP_LOGW(TAG, "This is a warning!");
        ESP_LOGE(TAG, "This is an error!");
        vTaskDelay(pdMS_TO_TICKS(10000));
    }
}