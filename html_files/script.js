const DemoApp = {
        initData: Telegram.WebApp.initData || '',
        initDataUnsafe: Telegram.WebApp.initDataUnsafe || {},
        MainButton: Telegram.WebApp.MainButton,

        init(options) {
            document.body.style.visibility = '';
            Telegram.WebApp.ready();
            Telegram.WebApp.MainButton.setParams({
                text: 'CLOSE WEBVIEW',
                is_visible: true
            }).onClick(DemoApp.close);
        },
        close() {
            Telegram.WebApp.close();
        },

        scanQrCode(button) {
            if (!DemoApp.initDataUnsafe.query_id) {
                alert('WebViewQueryId not defined');
                return;
            }

            document.querySelectorAll('button').forEach((btn) => btn.disabled = true);

            const btn = document.querySelector('#btn_status');
            btn.textContent = 'Sending...';

            Telegram.WebApp.showScanQrPopup({text: 'with any link'}, function (qrCode) {
                // Process the scanned QR code for order
                // For this example, we assume the QR code contains the order ID
                if (button == "order") {
                    DemoApp.apiRequest('/orders/' + qrCode, function(result) {
                        document.querySelectorAll('button').forEach((btn) => btn.disabled = false);

                        if (result.response) {
                            if (result.response.ok) {
                                btn.textContent = 'Message sent successfully!';
                                btn.className = 'ok';
                                btn.style.display = 'block';
                            } else {
                                btn.textContent = result.response.description;
                                btn.className = 'err';
                                btn.style.display = 'block';
                                alert(result.response.description);
                            }
                        } else if (result.error) {
                            btn.textContent = result.error;
                            btn.className = 'err';
                            btn.style.display = 'block';
                            alert(result.error);
                        } else {
                            btn.textContent = 'Unknown error';
                            btn.className = 'err';
                            btn.style.display = 'block';
                            alert('Unknown error');
                        }
                    });
                } else {
                    DemoApp.apiRequest('/products/' + qrCode, function(result) {
                        document.querySelectorAll('button').forEach((btn) => btn.disabled = false);

                        if (result.response) {
                            if (result.response.ok) {
                                btn.textContent = 'Message sent successfully!';
                                btn.className = 'ok';
                                btn.style.display = 'block';
                            } else {
                                btn.textContent = result.response.description;
                                btn.className = 'err';
                                btn.style.display = 'block';
                                alert(result.response.description);
                            }
                        } else if (result.error) {
                            btn.textContent = result.error;
                            btn.className = 'err';
                            btn.style.display = 'block';
                            alert(result.error);
                        } else {
                            btn.textContent = 'Unknown error';
                            btn.className = 'err';
                            btn.style.display = 'block';
                            alert('Unknown error');
                        }
                    });
                }
                Telegram.WebApp.showAlert(qrCode);
                return true;
            });
        },
        apiRequest(endpoint, onCallback) {
            // DISABLE BACKEND FOR FRONTEND DEMO
            // YOU CAN USE YOUR OWN REQUESTS TO YOUR OWN BACKEND
            // CHANGE THIS CODE TO YOUR OWN
//            return onCallback && onCallback({error: 'This function (' + method + ') should send requests to your backend. Please, change this code to your own.'});
            const api_url = 'http://localhost:8000'

            fetch(api_url + endpoint
            ).then(function(response) {
                return response.json();
            }).then(function(result) {
                onCallback && onCallback(result);
            }).catch(function(error) {
                onCallback && onCallback({error: 'Server error'});
            });
        }
}


function mainToProductBtn() {
    document.getElementById("main_btn").style.display = "none";
    document.getElementById("product_btn").style.display = "block";
}

postData = {
                        "order_id": orderId,
                        "product_id": qrCode,
                        "product_name": productName,
                        "date_of_arrival": 5545.322,
                        "temporary_location": "AAA4512"
                    };
                    fetch(apiUrl + "/reports/arrival_date", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiY29udHJvbGxlciIsImV4cGlyZXMiOjIzMjExNzc0ODIuMjI2MzAwMn0.X4VA_ST28ETT9KF6KMPEsnpdqDWlT8yUwNaQbcvi4-0'
                        },
                        body: JSON.stringify(postData)
                    })
                    .then(response => {
                        // Check if the request was successful
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        // Parse the response data as JSON
                        return response.json();
                    })
                    .then(data => {
                        // Process the data returned from the server
                        console.log(data);
                        // Disable only the selected product button
                        const productButtons = document.getElementById('product_list').getElementsByTagName('button');
                        for (let i = 0; i < productButtons.length; i++) {
                            const button = productButtons[i];
                            if (button.textContent === productName) {
                                button.disabled = true;
                                button.style.backgroundColor = 'gray'
                            }
                        }
                    })
                    .catch(error => {
                        // Handle any errors that occurred during the fetch
                        console.error('Error:', error);
                    });