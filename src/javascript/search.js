"use strict";

const index = new FlexSearch.Index();
const ids = [];

async function main() {
    const resp = await fetch("search/data");
    const json = await resp.json();

    for (const paste of json.pastes) {
        ids.push([paste.title, paste.id]);
        const id = ids.length - 1;
        let lineIdx = 1;
        for (const line of paste.content.split("\n")) {
            ids.push([id, lineIdx, line]);
            index.add(ids.length - 1, line);
            lineIdx++;
        }
    }

    if (document.location.hash.length > 1) {
        searchInput.value = decodeURI(document.location.hash.substring(1));
        handle_search({preventDefault: () => {}});
    }
}

main();

const searchInput = document.getElementById("search");
const resultsElements = document.getElementById("search-results");

function handle_search(e) {
    e.preventDefault();

    resultsElements.innerHTML = "";

    const searchText = searchInput.value;
    document.location.hash = "#" + searchText;
    const search = index.search(searchText);

    const r = new Map();
    for (const lid of search) {
        const [id, lineIdx, line] = ids[lid];
        if (!r.has(id)) {
            r.set(id, []);
        }
        r.get(id).push([lineIdx, line]);
    }
    // order by original order
    const keys = [...r.keys()];
    keys.sort();
    for (const id of keys) {
        const lines = r.get(id);
        const [title, paste_id] = ids[id];
        const div = document.createElement("div");
        resultsElements.appendChild(div);
        div.className = "search-result";
        const link = document.createElement("a");
        div.appendChild(link);
        link.setAttribute("href", paste_id);
        link.className = "search-result-link";
        link.innerText = title;

        const tbl = document.createElement("table");
        div.appendChild(tbl);
        const tbody = document.createElement("tbody");
        tbl.appendChild(tbody);

        let tblHtml = "";
        lines.sort((a, b) => a[0] - b[0]);
        for (const line of lines) {
            const nr = line[0];
            tblHtml += `<tr><td class="line-number" id="L${nr}"><a href="${paste_id}#L${nr}">${nr}</a></td><td class="line">${new Option(line[1]).innerHTML}</td></tr>`;
        }
        tbody.innerHTML = tblHtml;
    }
}

document.getElementById("search-form").onsubmit = handle_search;
