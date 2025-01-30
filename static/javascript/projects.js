document.addEventListener('DOMContentLoaded', function() {
    Promise.all([
        fetch('projects.json').then(response => response.json()),
        fetch('tags.json').then(response => response.json())
    ])
    .then(([projectFiles, tagsData]) => {
        const otherContainer = document.getElementById('projects');
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

                // Create filter buttons with colors for tags present in projects
                Object.entries(tagsData).forEach(([category, { selected_colour, unselected_colour, tags }]) => {
                    tags.filter(tag => allTags.has(tag)).forEach(tag => {
                        const tagButton = document.createElement('button');
                        tagButton.classList.add('btn', 'btn-primary', 'm-1');
                        tagButton.textContent = tag;
                        tagButton.style.color = selected_colour;
                        tagButton.style.borderColor = selected_colour;
                        tagButton.style.backgroundColor = unselected_colour;
                        tagButton.innerHTML = ` ${tag} <i class="fas fa-plus" style="color: ${selected_colour};"></i>`;
                        tagButton.addEventListener('click', (event) => {
                            event.preventDefault();
                            toggleTag(tag, tagButton, selected_colour, unselected_colour);
                        });
                        filterContainer.appendChild(tagButton);
                    });
                });

                // Function to toggle tag selection
                function toggleTag(tag, button, selected_colour, unselected_colour) {
                    if (selectedTags.has(tag)) {
                        selectedTags.delete(tag);
                        button.style.backgroundColor = unselected_colour;
                        button.style.color = selected_colour;
                        button.innerHTML = ` ${tag} <i class="fas fa-plus" style="color: ${selected_colour};"></i>`;
                    } else {
                        selectedTags.add(tag);
                        button.style.backgroundColor = selected_colour;
                        button.style.color = 'white';
                        button.innerHTML = `${tag} <i class="fas fa-plus" style="color: white;"></i>`;
                    }
                    filterProjects();
                }

                // Function to filter projects by selected tags
                function filterProjects() {
                    console.log('Selected Tags:', [...selectedTags]);
                    const cards = document.querySelectorAll('.card-project-other');
                    cards.forEach(card => {
                        const projectTags = Array.from(card.querySelectorAll('.project-tags span')).map(span => span.textContent.replace('#', ''));
                        console.log('Project Tags:', projectTags);
                        const matches = [...selectedTags].every(tag => projectTags.includes(tag));
                        if (matches || selectedTags.size === 0) {
                            card.closest('.col-12, .col-sm-12, .col-md-6, .col-lg-4').classList.remove('hidden'); // Show the card
                        } else {
                            card.closest('.col-12, .col-sm-12, .col-md-6, .col-lg-4').classList.add('hidden'); // Hide the card
                        }
                    });
                }

                // Render all other projects in rows
                projectsData.forEach(project => {
                    const tags = project.tags.map(tag => {
                        const tagColor = Object.entries(tagsData).find(([category, { tags }]) => tags.includes(tag))[1].selected_colour;
                        return `<span class="tag" style="color: ${tagColor};">#${tag}</span>`;
                    }).join('');

                    const projectRow = `
                        <div class="col-12 col-sm-12 col-md-6 col-lg-4 mb-4 d-flex">
                            <a href="${project.link}" target="_blank" class="card card-hover card-project-other m-0">
                                <img class="card-img-top" src="${project.image}" alt="${project.title}">
                                <div class="card-body">
                                    <h2 class="card-title">${project.title}</h2>
                                    <p class="card-text">${project.description}</p>
                                    <div class="project-tags">${tags}</div>
                                </div>
                            </a>
                        </div>
                    `;

                    otherContainer.innerHTML += projectRow;
                });
            })
            .catch(error => console.error('Error loading project data:', error));
    })
    .catch(error => console.error('Error loading data:', error));
});