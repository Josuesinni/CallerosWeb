
const data = [
    { name: 'Charlie', age: 35, city: 'Chicago', estado: "Activo" },
    { name: 'Alice', age: 25, city: 'New York', estado: "Activo" },
    { name: 'Bob', age: 30, city: 'Los Angeles', estado: "Activo" },
    { name: 'Charlie', age: 35, city: 'Chicago', estado: "Inactivo" },
    { name: 'Charlie', age: 35, city: 'Chicago', estado: "Inactivo" },
    { name: 'Charlie', age: 35, city: 'Chicago', estado: "Inactivo" },
    { name: 'Charlie', age: 35, city: 'Chicago', estado: "Inactivo" },
    { name: 'Charlie', age: 35, city: 'Chicago', estado: "Inactivo" },
    { name: 'Charlie', age: 35, city: 'Chicago', estado: "Inactivo" },
    // Add more data as needed
];

let dataFiltered = []

document.addEventListener('DOMContentLoaded', () => {


    const rowsPerPage = 5;
    let currentPage = 1;

    const tableBody = document.querySelector('#myTable tbody');
    const filterInput = document.getElementById('filterInput');
    const paginationControls = document.getElementById('paginationControls');

    function renderTable(data) {
        tableBody.innerHTML = '';
        data.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${row.name}</td><td>${row.age}</td><td>${row.city}</td>`;
            tableBody.appendChild(tr);
        });
    }

    function paginate(data, page, rowsPerPage) {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return data.slice(start, end);
    }

    function renderPaginationControls(totalRows, rowsPerPage) {
        paginationControls.innerHTML = '';
        const totalPages = Math.ceil(totalRows / rowsPerPage);
        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement('button');
            button.textContent = i;
            button.addEventListener('click', () => {
                currentPage = i;
                updateTable();
            });
            paginationControls.appendChild(button);
        }
    }
    const sortByState = document.getElementById("estado");
    sortByState.addEventListener("change", updateTable)

    function updateTable() {
        let filterConditions={};
        let status = (sortByState.value == 0) ? "Activo" : "Inactivo";
        if (sortByState.value == 0 || sortByState.value == 1){
            filterConditions.estado=status
        }

        const filteredData = data.filter(item =>
            Object.keys(filterConditions).every(key => item[key] === filterConditions[key])
        );
        /*console.log(filteredData);*/

        /*const filteredData = data.filter(row => 
            row.name.toLowerCase().includes(filterInput.value.toLowerCase()) ||
            row.city.toLowerCase().includes(filterInput.value.toLowerCase())
        );*/
        const paginatedData = paginate(filteredData, currentPage, rowsPerPage);
        renderTable(paginatedData);
        renderPaginationControls(filteredData.length, rowsPerPage);
    }

    filterInput.addEventListener('input', () => {
        currentPage = 1;
        updateTable();
    });

    updateTable();
});