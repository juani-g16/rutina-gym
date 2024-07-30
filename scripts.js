function openDay(evt, dayName) {
    var i, tabcontent, tablinks;

    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    document.getElementById(dayName).style.display = "block";
    evt.currentTarget.className += " active";
}

function toggleStrike(checkbox) {
    var row = checkbox.parentNode.parentNode;
    if (checkbox.checked) {
        row.classList.add("checked");
    } else {
        row.classList.remove("checked");
    }
    saveProgress();
}

function handleWeightChange(select) {
    if (select.value === "otro") {
        openModal(select);
    } else {
        saveProgress();
    }
}

function openModal(select) {
    var modal = document.getElementById("weightModal");
    modal.style.display = "block";
    modal.currentSelect = select;
}

function closeModal() {
    var modal = document.getElementById("weightModal");
    modal.style.display = "none";
}

function addCustomWeight() {
    var weight = document.getElementById("customWeight").value;
    var select = document.getElementById("weightModal").currentSelect;
    var option = document.createElement("option");
    option.value = weight;
    option.text = weight;
    select.add(option);
    select.value = weight;

    saveCustomWeights();
    closeModal();
    saveProgress();
}

function saveCustomWeights() {
    var customWeights = [];
    var selects = document.querySelectorAll("tbody select");
    selects.forEach(function(select) {
        for (var i = 0; i < select.options.length; i++) {
            if (select.options[i].value !== "otro" && !isDefaultWeight(select.options[i].value)) {
                customWeights.push(select.options[i].value);
            }
        }
    });
    localStorage.setItem("customWeights", JSON.stringify(customWeights));
}

function isDefaultWeight(value) {
    var defaultWeights = [];
    for (var i = 2.5; i <= 80; i += 2.5) {
        defaultWeights.push(i.toString());
    }
    return defaultWeights.includes(value);
}

document.addEventListener("DOMContentLoaded", function() {
    document.querySelector(".tab button").click();

    var customWeights = JSON.parse(localStorage.getItem("customWeights")) || [];
    var weightSelects = document.querySelectorAll("tbody select");
    weightSelects.forEach(function(select) {
        for (var i = 2.5; i <= 80; i += 2.5) {
            var option = document.createElement("option");
            option.value = i;
            option.text = i;
            select.add(option);
        }
        customWeights.forEach(function(weight) {
            var option = document.createElement("option");
            option.value = weight;
            option.text = weight;
            select.add(option);
        });
        var option = document.createElement("option");
        option.value = "otro";
        option.text = "Otro";
        select.add(option);
    });

    var weekSelector = document.getElementById("weekSelector");
    for (var i = 1; i <= 12; i++) { // Suponiendo 12 semanas
        var option = document.createElement("option");
        option.value = "Semana " + i;
        option.text = "Semana " + i;
        weekSelector.add(option);
    }

    loadWeekData();
});

function saveProgress() {
    var week = document.getElementById("weekSelector").value;
    var data = {};

    var tabcontents = document.getElementsByClassName("tabcontent");
    for (var i = 0; i < tabcontents.length; i++) {
        var table = tabcontents[i].querySelector("table tbody");
        var rows = table.rows;
        for (var j = 0; j < rows.length; j++) {
            var cells = rows[j].cells;
            var exercise = cells[0].innerText;
            var weight = cells[3].querySelector("select").value;
            var done = cells[4].querySelector("input").checked;
            if (!data[tabcontents[i].id]) {
                data[tabcontents[i].id] = {};
            }
            data[tabcontents[i].id][exercise] = {
                weight: weight,
                done: done
            };
        }
    }

    localStorage.setItem(week, JSON.stringify(data));
}

function loadWeekData() {
    var week = document.getElementById("weekSelector").value;
    var data = JSON.parse(localStorage.getItem(week));

    if (data) {
        var tabcontents = document.getElementsByClassName("tabcontent");
        for (var i = 0; i < tabcontents.length; i++) {
            var table = tabcontents[i].querySelector("table tbody");
            var rows = table.rows;
            for (var j = 0; j < rows.length; j++) {
                var cells = rows[j].cells;
                var exercise = cells[0].innerText;
                if (data[tabcontents[i].id] && data[tabcontents[i].id][exercise]) {
                    cells[3].querySelector("select").value = data[tabcontents[i].id][exercise].weight;
                    cells[4].querySelector("input").checked = data[tabcontents[i].id][exercise].done;
                    if (data[tabcontents[i].id][exercise].done) {
                        rows[j].classList.add("checked");
                    } else {
                        rows[j].classList.remove("checked");
                    }
                }
            }
        }
    } else {
        var tabcontents = document.getElementsByClassName("tabcontent");
        for (var i = 0; i < tabcontents.length; i++) {
            var table = tabcontents[i].querySelector("table tbody");
            var rows = table.rows;
            for (var j = 0; j < rows.length; j++) {
                var cells = rows[j].cells;
                cells[3].querySelector("select").value = "";
                cells[4].querySelector("input").checked = false;
                rows[j].classList.remove("checked");
            }
        }
    }
}
