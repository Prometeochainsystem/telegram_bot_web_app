
const botToken = "6504257620:AAH4_RxmRPAWuIlQlpwwFirf6IziGssdKGQ";
const apiUrl = "https://api.telegram.org/bot" + botToken + "/getUpdates";


const DemoApp = {
        initData: Telegram.WebApp.initData || '',
        initDataUnsafe: Telegram.WebApp.initDataUnsafe || {},
        MainButton: Telegram.WebApp.MainButton,

        init(options) {
            Telegram.WebApp.ready();
            Telegram.WebApp.MainButton.setParams({
                text: 'CLOSE WEBVIEW',
                is_visible: true
            }).onClick(DemoApp.close);
        },
        close() {
            Telegram.WebApp.close();
        },

        scanQrCode() {

            document.querySelectorAll('button').forEach((btn) => btn.disabled = true);

            fetch(apiUrl)
              .then(response => response.json())
              .then(data => {
                if (data.ok) {
                  const updates = data.result;
                  if (updates.length > 0) {
                    const chatId = updates[updates.length - 1].chat.id;
                    console.log("Newest update:", chatId);
                  } else {
                    console.log("No updates received.");
                  }
                } else {
                  console.log("Request failed:", data.description);
                }
              })
              .catch(error => {
                console.error("Error:", error);
              });

            Telegram.WebApp.showScanQrPopup({text: 'with any link'}, function (qrCode) {
                // Process the scanned QR code for order
                // For this example, we assume the QR code contains the order ID
                Telegram.WebApp.sendMessage({
                  chat_id: chatId,
                  text: qrCode,
                  token: botToken,
                });

                DemoApp.close();
                return true;
            });
        }
}

DemoApp.init();
