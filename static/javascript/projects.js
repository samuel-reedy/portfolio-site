document.addEventListener('DOMContentLoaded', function() {
    Promise.all([
        fetch('projects.json').then(response => response.json()),
        fetch('tags.json').then(response => response.json())
    ])
    .then(([projectFiles, tagsData]) => {
        const container = document.getElementById('projects-sections');
        const filterContainer = document.getElementById('filter-tags');
        const allTags = new Set();
        let selectedTags = new Set();

        // Load all project files
        const projectPromises = projectFiles.map(file => fetch(`projects/${file}`).then(response => response.json()));
        Promise.all(projectPromises)
            .then(projectsData => {
                // Collect all unique tags and check for missing tags
                projectsData.forEach(project => {
                    project.tags.forEach(tag => {
                        if (!Object.values(tagsData).some(category => category.tags.includes(tag))) {
                            throw new Error(`Tag "${tag}" in project "${project.title}" is not defined in tags.json`);
                        }
                        allTags.add(tag);
                    });
                });

                // Create filter buttons with colors
                Object.entries(tagsData).forEach(([category, { selected_colour, unselected_colour, tags }]) => {
                    tags.forEach(tag => {
                        const tagButton = document.createElement('button');
                        tagButton.classList.add('btn', 'btn-primary', 'm-1');
                        tagButton.textContent = tag;
                        tagButton.style.color = 'white';
                        tagButton.style.borderColor = selected_colour;
                        tagButton.style.backgroundColor = unselected_colour;
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
                    const rows = document.querySelectorAll('.project-row');
                    rows.forEach(row => {
                        const projectTags = Array.from(row.querySelectorAll('.project-tags span')).map(span => span.textContent);
                        const matches = [...selectedTags].every(tag => projectTags.includes(tag));
                        const card = row.closest('.card');
                        if (matches || selectedTags.size === 0) {
                            card.classList.remove('hidden'); // Show the card
                        } else {
                            card.classList.add('hidden'); // Hide the card
                        }
                    });
                }

                // Render all projects in rows
                projectsData.forEach(project => {
                    const tags = project.tags.map(tag => {
                        const tagColor = Object.entries(tagsData).find(([category, { tags }]) => tags.includes(tag))[1].selected_colour;
                        return `<span class="tag" style="background-color: ${tagColor};">${tag}</span>`;
                    }).join('');

                    const projectRow = `
                        <div class="card p-3 mb-4">
                            <div class="row project-row">
                                <div class="col-12 mb-2 d-flex justify-content-between align-items-center">
                                    <h2 class="card-title data-title">${project.title}</h2>
                                    <div class="project-tags">${tags}</div>
                                </div>
                                ${project.images.map((image, index) => `
                                    <div class="col-md-4 d-flex flex-column align-items-start">
                                        <div class="project-text">
                                            <div class="description-title-container mb-3">
                                                ${index === 0 ? '.GOAL' : index === 1 ? '.METHOD' : '.RESULT'}
                                            </div>
                                            <ul>
                                                ${(index === 0 ? project.what : index === 1 ? project.how : project.result).map(line => `<li>${line}</li>`).join('')}
                                            </ul>
                                        </div>
                                
                                        <div class="image-container mt-auto ">
                                            <a href="${image}" data-lightbox="${project.title}" data-title="${project.title} Image ${index + 1}" class="align-bottom">
                                                <img src="${image}" class="img-fluid card-img" alt="${project.title} Image ${index + 1}">
                                            </a>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `;
                    container.innerHTML += projectRow;
                });
            })
            .catch(error => console.error('Error loading project data:', error));
    })
    .catch(error => console.error('Error loading data:', error));
});