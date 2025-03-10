from flask import Flask, render_template, url_for, request, redirect, jsonify

app = Flask(__name__)


class MenuItem:

    def __init__(self, name, description, price, image_filename):
        self.name = name
        self.description = description
        self.price = price
        self.image_filename = image_filename  # Store filename instead of generating URL

    def to_dict(self):
        return {
            "name": self.name,
            "description": self.description,
            "price": self.price,
            "image_filename": self.image_filename  # Send filename, not URL
        }


menu_items = [
    MenuItem("Beef Stew", "Slow-cooked tender beef with potatoes, carrots, and a rich savory sauce.", 12.99, "beefstew.jpg"),
    MenuItem("Beef Stir Fry", "Juicy beef strips stir-fried with bell peppers in a flavorful sauce.", 10.99, "Beefstirfry.jpg"),
    MenuItem("Chicken Stew", "Delicious chicken stew with vegetables in a creamy, comforting sauce.", 11.99, "chickenstew.jpg"),
    MenuItem("Chicken Wings", "Crispy fried chicken wings served with a side of dipping sauce.", 9.99, "chiken wings fry.jpg"),
    MenuItem("Lemongrass Pork Ribs", "Tender pork ribs marinated in lemongrass and grilled to perfection.", 14.99, "Fried lemongrass prork ribs.jpg"),
    MenuItem("Nigerian Chicken Stew", "Rich and spicy Nigerian-style chicken stew.", 13.99, "Nigerianchikenstew.jpg"),
    MenuItem("Pork Chop", "Grilled pork chop glazed with a sweet and savory sauce.", 12.49, "popchop .jpg"),
    MenuItem("Grilled Steak", "Juicy grilled steak topped with fresh herbs.", 16.99, "steak.jpg"),
    MenuItem("Sticky Chicken Fry", "Sticky glazed chicken wings garnished with sesame seeds.", 10.99, "stickychickenfry.jpg"),
    MenuItem("Garlic Green Beans", "Crispy stir-fried green beans with garlic.", 8.99, "stir-fried garlic green beans.jpg"),
]


@app.route('/')
def homepage():
    return render_template('home.html')


@app.route('/menu')
def menu():
    menu_items_data = [{
        "name": item.name,
        "description": item.description,
        "price": item.price,
        "image_url": url_for('static', filename=f'images/{item.image_filename}')
    } for item in menu_items]
    return render_template('menu.html', menu_items=menu_items_data)


@app.route('/togo')
def togo():
    menu_items_data = [{
        "name": item.name,
        "description": item.description,
        "price": item.price,
        "image_url": url_for('static', filename=f'images/{item.image_filename}')
    } for item in menu_items]

    return render_template('Togo.html', menu_items=menu_items_data)


@app.route('/book')
def book():
    return render_template('book.html')


@app.route('/customer_togo')
def customer_togo():
    return render_template('customer_togo.html')


@app.route('/process_order', methods=['POST'])
def process_order():
    """
    This route handles the final confirmation of the TOGO order.
    It receives order details from `customer_togo.html` and redirects
    to the homepage after confirmation.
    """
    data = request.json  # Receive JSON data from frontend

    if not data:
        return jsonify({"status": "error", "message": "Invalid order data"}), 400

    customer_name = data.get("name")
    customer_address = data.get("address")
    customer_phone = data.get("phone")
    order_list = data.get("orderList")
    total_price = data.get("totalPrice")

    if not customer_name or not customer_address or not customer_phone or not order_list:
        return jsonify({"status": "error", "message": "Missing required fields"}), 400

    # Simulate order processing (in a real system, this would save to a database)
    print(f"Order received from {customer_name}: {order_list}, Total: ${total_price}")

    return jsonify({"status": "success", "message": "Order placed successfully!"})


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
