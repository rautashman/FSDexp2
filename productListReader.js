//Product Data in JSON Object format
const products = [
    { id: 1, name: "Laptop",       price: 75000, category: "Electronics" },
    { id: 2, name: "Headphones",   price: 2500,  category: "Electronics" },
    { id: 3, name: "Notebook",     price: 150,   category: "Stationery" },
    { id: 4, name: "Backpack",     price: 1800,  category: "Accessories" },
    { id: 5, name: "Smartphone",   price: 45000, category: "Electronics" },
    { id: 6, name: "Pen Set",      price: 300,   category: "Stationery" },
    { id: 7, name: "Desk Lamp",    price: 1200,  category: "Home" },
    { id: 8, name: "Water Bottle", price: 500,   category: "Accessories" }
];

//Displaying
function displayProducts(list) {

    console.log(
        "ID".padEnd(6) +
        "Name".padEnd(16) +
        "Price".padEnd(10) +
        "Category"
    );
    console.log("-------------------------------------------");

    list.forEach(function (product) {
        console.log(
            String(product.id).padEnd(6) +
            product.name.padEnd(16) +
            String(product.price).padEnd(10) +
            product.category
        );
    });
}

//Filtering
function filterByMinPrice(list, minPrice) {
    return list.filter(function (product) {
        return product.price >= minPrice;
    });
}

console.log("All Products:");
displayProducts(products);

const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("\nEnter minimum price to filter products: ", function (input) {
    var minPrice = parseFloat(input);

    if (isNaN(minPrice)) {
        console.log("\nInvalid input. Please enter a valid number.");
    } else {
        console.log("\nProducts with price >= " + minPrice + ":");
        var filtered = filterByMinPrice(products, minPrice);
        displayProducts(filtered);
    }

    rl.close();
});
