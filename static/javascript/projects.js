document.addEventListener('DOMContentLoaded', function() {
    Promise.all([
        fetch('projects.json').then(response => response.json()),
        fetch('tags.json').then(response => response.json())
    ])
    .then(([projectsData, tagsData]) => {
        const container = document.getElementById('projects-sections');
        const filterContainer = document.getElementById('filter-tags');
        const allTags = new Set();
        let selectedTags = new Set();

        // Collect all unique tags and check for missing tags
        Object.values(projectsData).forEach(projects => {
            projects.forEach(project => {
                project.tags.forEach(tag => {
                    if (!Object.values(tagsData).some(category => category.tags.includes(tag))) {
                        throw new Error(`Tag "${tag}" in project "${project.title}" is not defined in tags.json`);
                    }
                    allTags.add(tag);
                });
            });
        });

        // Create filter buttons with colors
        Object.entries(tagsData).forEach(([category, { selected_colour, unselected_colour, tags }]) => {
            tags.forEach(tag => {
                const tagButton = document.createElement('button');
                tagButton.classList.add('btn', 'btn-primary', 'm-1');
                tagButton.textContent = tag;
                tagButton.style.color = 'white';
                tagButton.style.borderColor = unselected_colour;
                tagButton.style.backgroundColor = unselected_colour
                tagButton.innerHTML = ` ${tag} <i class="fas fa-plus"></i>`;
                tagButton.addEventListener('click', () => toggleTag(tag, tagButton, selected_colour, unselected_colour));
                filterContainer.appendChild(tagButton);
            });
        });

        // Function to toggle tag selection
        function toggleTag(tag, button, selected_colour, unselected_colour) {
            if (selectedTags.has(tag)) {
                selectedTags.delete(tag);
                button.classList.add('btn-primary');
                button.style.backgroundColor = unselected_colour;
                button.style.color = 'white';
                button.innerHTML = ` ${tag} <i class="fas fa-plus"></i>`;
            } else {
                selectedTags.add(tag);
                button.classList.remove('btn-primary');
                button.classList.add('btn-primary');
                button.style.backgroundColor = selected_colour;
                button.style.color = 'white';
                button.innerHTML = `${tag} <i class="fas fa-check"></i>`;
            }
            filterProjects();
        }

        // Function to filter projects by selected tags
        function filterProjects() {
            const cards = document.querySelectorAll('.card');
            cards.forEach(card => {
                const projectTags = card.querySelector('.card-tags').textContent;
                const matches = [...selectedTags].every(tag => projectTags.includes(tag));
                if (matches || selectedTags.size === 0) {
                    card.parentElement.style.display = 'block';
                } else {
                    card.parentElement.style.display = 'none';
                }
            });
        }

        // Render all projects in one section
        const section = document.createElement('div');
        section.classList.add('mt-5');

        const row = document.createElement('div');
        row.classList.add('row');

        Object.values(projectsData).forEach(projects => {
            projects.forEach(project => {
                const tags = project.tags.map(tag => {
                    const tagColor = Object.entries(tagsData).find(([category, { tags }]) => tags.includes(tag))[1].selected_colour;
                    return `<span style="background-color: ${tagColor};">${tag}</span>`;
                }).join('');
                const projectCard = `
                    <div class="col-md-4">
                        <div class="card mb-4 shadow" onclick="window.location.href='${project.link}'">
                            <img src="${project.image}" class="card-img" alt="${project.title}">
                            <div class="card-img-overlay">
                                <i class="fas ${project.icon} card-icon"></i>
                                <h5 class="card-title"> ${project.short_title || project.title}</h5>
                                <div class="card-description">
                                    <p class="card-text">${project.description}</p>
                                </div>
                                <div class="card-tags">${tags}</div>
                            </div>
                        </div>
                    </div>
                `;
                row.innerHTML += projectCard;
            });
        });

        section.appendChild(row);
        container.appendChild(section);
    })
    .catch(error => console.error('Error loading data:', error));
});