let defaultProducts = [
    { id: 1, name: "Laptop Dell XPS 13", price: 28500000, centre: 12 },
    { id: 2, name: "Chuột Logitech MX Master", price: 1850000, centre: 34 },
    { id: 3, name: "Bàn phím Keychron", price: 2200000, centre: 7 },
    { id: 4, name: "Áo thun Basic", price: 390000, centre: 0 },
    { id: 5, name: "Cà phê rang xay 500g", price: 185000, centre: 58 },
];

let products = JSON.parse(localStorage.getItem("products")) || defaultProducts;

const tBody = document.getElementById("tbody");
const nameInput = document.getElementById("iName");
const priceInput = document.getElementById("iPrice");
const stockInput = document.getElementById("iStock");
const btnSubmit = document.getElementById("btnSubmit");
const formTitle = document.getElementById("formTitle");
const editIdInput = document.getElementById("editId");
const totalBadge = document.getElementById("totalBadge");

const renderProducts = (listToRender) => {
    tBody.innerHTML = "";
    
    if (listToRender.length === 0) {
        document.getElementById("emptyState").style.display = "block";
    } else {
        document.getElementById("emptyState").style.display = "none";
        listToRender.forEach((product, index) => {
            let tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${index + 1}</td>
                <td class="td-name">${product.name}</td>
                <td class="td-price">${product.price.toLocaleString()} ₫</td>
                <td class="center" style="font-weight: 700">${product.centre}</td>
                <td>
                  <div class="td-actions">
                    <button class="btn btn-sm btn-edit" onclick="editProduct(${product.id})">✏ Sửa</button>
                    <button class="btn btn-sm btn-del" onclick="deleteProduct(${product.id})">✕ Xóa</button>
                  </div>
                </td>`;
            tBody.appendChild(tr);
        });
    }
    totalBadge.innerText = `${listToRender.length} sản phẩm`;
};

const saveData = () => {
    localStorage.setItem("products", JSON.stringify(products));
};

const addProduct = () => {
    const nameValue = nameInput.value.trim();
    const priceValue = priceInput.value;
    const stockValue = stockInput.value;
    const editId = editIdInput.value;

    if (!nameValue) {
        alert("Vui lòng nhập tên sản phẩm.");
        return;
    }
    
    const isDuplicate = products.some(p => p.name.toLowerCase() === nameValue.toLowerCase() && p.id != editId);
    if (isDuplicate) {
        alert("Tên sản phẩm đã tồn tại.");
        return;
    }
    if (isNaN(priceValue) || priceValue <= 0) {
        alert("Giá phải là số dương lớn hơn 0.");
        return;
    }

    if (isNaN(stockValue) || stockValue < 0) {
        alert("Tồn kho phải là số nguyên lớn hơn hoặc bằng 0.");
        return;
    }

    if (editId) {
        const index = products.findIndex(p => p.id == editId);
        products[index] = { ...products[index], 
            name: nameValue, 
            price: priceValue, 
            centre: stockValue 
        };
        alert("Cập nhật sản phẩm thành công!");
    } else {
        const newProduct = {
            id: Date.now(),
            name: nameValue,
            price: priceValue,
            centre: stockValue
        };
        products.push(newProduct);
        alert("Thêm sản phẩm thành công!");
    }

    saveData();
    resetForm();
    renderProducts();
};

const editProduct = (id) => {
    const product = products.find(p => p.id === id);
    if (product) {
        nameInput.value = product.name;
        priceInput.value = product.price;
        stockInput.value = product.centre;
        editIdInput.value = product.id;
        
        formTitle.innerText = "Chỉnh sửa sản phẩm";
        btnSubmit.innerText = "Lưu thay đổi";
    }
};


const deleteProduct = (id) => {
    if (confirm("Bạn có chắc muốn xóa sản phẩm này không?")) {
        products = products.filter(p => p.id !== id);
        saveData();
        renderProducts();
        alert("Xóa sản phẩm thành công!");
    }
};

const resetForm = () => {
    nameInput.value = "";
    priceInput.value = "";
    stockInput.value = "";
    editIdInput.value = "";
    formTitle.innerText = "Thêm sản phẩm mới";
    btnSubmit.innerText = "Thêm sản phẩm";
};
const searchProducts = () => {
    const val = document.getElementById("searchInput").value.toLowerCase();
    const result = products.filter(s => s.name.toLowerCase().includes(val));
    renderProducts(result);
};
let sortProduct = document.getElementById("sortSelect");
sortProduct.addEventListener("change", (e) => {
    let sortedProducts = [...products];
    const val = e.target.value;
    if (val === "name_asc") sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
    if (val === "name_desc") sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
    if (val === "price_asc") sortedProducts.sort((a, b) => a.price - b.price);
    if (val === "price_desc") sortedProducts.sort((a, b) => b.price - a.price);
    renderProducts(sortedProducts);
});
renderProducts();
