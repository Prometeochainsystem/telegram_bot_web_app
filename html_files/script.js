// URL to fetch data from
const apiUrl = 'http://warehouse-app-test.prometeochain.io';


function scanQrCode(button) {
    Telegram.WebApp.showScanQrPopup({text: 'with any link'}, function (qrCode) {
        // Process the scanned QR code for order
        // For this example, we assume the QR code contains the order ID
        if (button == "order") {
            fetch(apiUrl + "/orders/" + qrCode, {
                headers: {
                    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiY29udHJvbGxlciIsImV4cGlyZXMiOjIzMjExNzc0ODIuMjI2MzAwMn0.X4VA_ST28ETT9KF6KMPEsnpdqDWlT8yUwNaQbcvi4-0'
                }
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
                product_list = data["products"]
                showOrderInfo(qrCode, product_list);
            })
            .catch(error => {
                // Handle any errors that occurred during the fetch
                console.error('Error:', error);
            });
        } else {
            const selectedProduct = document.getElementById("product_selected").innerHTML;
            const currentOrder = document.getElementById("order_id").innerHTML;
            orderId = currentOrder.slice(10)
            productName = selectedProduct.slice(18);
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
        }
        Telegram.WebApp.showAlert(qrCode);
        return true;
    });
}

//function scanProductQrCode() {
//    Telegram.WebApp.showScanQrPopup({}, function (qrCode) {
//        // Process the scanned QR code for product
//        // For this example, we assume the QR code contains the product ID
//    });
//}

function showOrderInfo(orderId, product_list) {
    document.getElementById("main_btn").style.display = "none";
    document.getElementById("product_btn").style.display = "block";
    document.getElementById("order_info").classList.remove("hidden");
    document.getElementById("order_id").innerText = "Order ID: " + orderId;

    const productList = document.getElementById('product_list');

    // Show the product list
    productList.style.display = 'block';

    // Clear previous product buttons
    productList.innerHTML = '';

    // Create product buttons
    product_list.forEach(product => {
        const productButton = document.createElement('button');
        productButton.textContent = product["name"];
        if (product["status"] == null) {
            productButton.onclick = function () {
                selectProduct(product["name"]);
            };
        } else {
            productButton.disabled = true;
            productButton.style.backgroundColor = 'gray'
        }
        const listItem = document.createElement('li');
        listItem.appendChild(productButton);
        productList.appendChild(listItem);
    });
    return true;
}


function selectProduct(productName) {
    document.getElementById("product_selected").innerText = "Selected Product: " + productName;
}
