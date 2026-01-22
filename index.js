const searchInput = document.getElementById('search');
const suggestions = document.getElementById('suggestions');
const repoList = document.getElementById('repoList');

let debounceTimer;

function debounce(fn, delay) {
    return (...args) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => fn(...args), delay);
    };
}

async function fetchRepositories(query) {
    const response = await fetch(
        `https://api.github.com/search/repositories?q=${query}&per_page=5`
    );
    const data = await response.json();
    return data.items || [];
}

function renderSuggestions(repos) {
    suggestions.textContent = '';

    repos.forEach(repo => {
        const item = document.createElement('div');
        item.className = 'suggestion';
        item.textContent = `${repo.name} - ${repo.owner.login}`;

        item.addEventListener('click', () => {
            addRepository(repo);
            clearAutocomplete();
        });

        suggestions.appendChild(item);
    });
}

function clearAutocomplete() {
    searchInput.value = '';
    suggestions.textContent = '';
}

function addRepository(repo) {
    const repoItem = document.createElement('div');
    repoItem.className = 'repo-item';

    const info = document.createElement('div');
    info.className = 'repo-info';

    const name = document.createElement('div');
    name.textContent = `Name: ${repo.name}`;

    const owner = document.createElement('div');
    owner.textContent = `Owner: ${repo.owner.login}`;

    const stars = document.createElement('div');
    stars.textContent = `Stars: ${repo.stargazers_count}`;

    info.append(name, owner, stars);

    const removeButton = document.createElement('button');
    removeButton.addEventListener('click', () => {
        repoItem.remove();
    });

    repoItem.append(info, removeButton);
    repoList.appendChild(repoItem);
}

const handleInput = debounce(async () => {
    const query = searchInput.value.trim();

    if (!query) {
        suggestions.textContent = '';
        return;
    }

    const repos = await fetchRepositories(query);
    renderSuggestions(repos);
}, 500);

searchInput.addEventListener('input', handleInput);
