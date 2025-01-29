document.addEventListener('DOMContentLoaded', function() {
    Promise.all([
        fetch('featured_projects.json').then(response => response.json()),
        fetch('tags.json').then(response => response.json())
    ])
    .then(([projectFiles, tagsData]) => {
        const workContainer = document.getElementById('featured-projects');

        // Load all project files
        const projectPromises = projectFiles.map(file => fetch(`projects/${file}`).then(response => response.json()));
        Promise.all(projectPromises)
            .then(projectsData => {
                // Render all featured projects
                projectsData.forEach(project => {
                    const tags = project.tags.map(tag => {
                        const tagColor = Object.entries(tagsData).find(([category, { tags }]) => tags.includes(tag))[1].selected_colour;
                        return `<span class="tag" style="background-color: ${tagColor};">${tag}</span>`;
                    }).join('');

                    const projectRow = `
                        <div class="col-12 col-sm-12 col-md-6 col-lg-4 mb-4 d-flex">
                            <div class="card card-hover">
                                <img class="card-img-top" src="${project.image}" alt="${project.title}">
                                <div class="card-body" style="background-color: ${project.background_colour};">
                                    <h2 class="card-title text-center">${project.title}</h2>
                                    <p class="card-text text-center">${project.description}</p>
                                    <div class="project-tags d-flex justify-content-center">${tags}</div>
                                </div>
                            </div>
                        </div>
                    `;

                    workContainer.innerHTML += projectRow;
                });
            })
            .catch(error => console.error('Error loading project data:', error));
    })
    .catch(error => console.error('Error loading data:', error));
});