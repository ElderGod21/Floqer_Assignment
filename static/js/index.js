function getHandle(className) {
    return document.querySelector('.' + className);
}
function getHandleAll(className) {
    return document.querySelectorAll('.' + className);
}
function sendRequestToServer(url, data, method, contentType, functionToReturn) {
    fetch(url, {
        method: method,
        body: JSON.stringify(data),
        headers: {
            'Content-Type': contentType
        }
    }).then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Server response wasn\'t OK');
        }
    })
    .then(response_json => {
        functionToReturn(response_json);
    })
}

function saveData(data) {
    const tableBody = getHandle('table-body');

    tableBody.innerHTML = '';
    const length = data.years.length;

    for (let i = 0; i < length; i++) {
        const tr = document.createElement('tr');
        const td1 = document.createElement('td');
        const td2 = document.createElement('td');
        const td3 = document.createElement('td');
        td1.textContent = data.years[i];
        td2.textContent = data.jobs[i];
        td3.textContent = data.avg_salary[i];
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.addEventListener('click', () => {
            const year = tr.children[0].textContent;
            sendRequestV2(year);
            smoothScrollToTable();
        });
        tableBody.appendChild(tr);
    }
}

function saveDataV2(data) {
    const table = getHandleAll('main-table')[1];
    if (table.classList.contains('hidden')) {
        table.classList.remove('hidden');
    }
    const yearSpan = getHandle('year-selected');
    yearSpan.textContent = data.year;
    const tableBody = getHandle('table-body-v2');

    tableBody.innerHTML = '';
    const length = data.jobs.length;

    for (let i = 0; i < length; i++) {
        const tr = document.createElement('tr');
        const td1 = document.createElement('td');
        const td2 = document.createElement('td');
        td1.textContent = data.jobs[i];
        td2.textContent = data.job_count[i];
        tr.appendChild(td1);
        tr.appendChild(td2);
        tableBody.appendChild(tr);
    }
}
function smoothScrollToTable() {
    setTimeout(() => {
        const table = getHandleAll('main-table')[1];
        table.scrollIntoView({ behavior: 'smooth' });
    }, 100);
}

function requestToSend(request_type, about_column, sort_type, year) {
    if (request_type === 'sendData'){
        const data = {
            request: 'sendData',
        }
        return data;
    }
    else if (request_type === 'sortData'){
        const data = {
            request: 'sortData',
            about_column: about_column,
            sort_by: sort_type
        }
        return data;
    }
    else if (request_type === 'sendDataV2'){
        const data = {
            request: 'sendDataV2',
            year: year
        }
        return data;
    }
}

function sendRequest(request_type, about_column, sort_type) {
    const url = '/process_data';
    const data = requestToSend(request_type, about_column, sort_type);
    const method = 'POST';
    const contentType = 'application/json';
    sendRequestToServer(url, data, method, contentType, saveData);
}

window.onload = () => {
    sendRequest('sendData', null, null, null);
}

const upArrow = getHandleAll('up');
const downArrow = getHandleAll('down');

upArrow.forEach((arrow) => {
    arrow.addEventListener('click', () => {
        about_column = arrow.id.split('-')[0];
        sendRequest('sortData', about_column, 'asc', null);
    });
});

downArrow.forEach((arrow) => {
    arrow.addEventListener('click', () => {
        about_column = arrow.id.split('-')[0];
        sendRequest('sortData', about_column, 'desc', null);
    });
});

function sendRequestV2(year) {
    const url = '/process_data';
    const data = requestToSend('sendDataV2', null, null, year);
    const method = 'POST';
    const contentType = 'application/json';
    sendRequestToServer(url, data, method, contentType, saveDataV2);
}