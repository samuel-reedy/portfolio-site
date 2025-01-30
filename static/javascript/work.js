document.addEventListener('DOMContentLoaded', function() {
    fetch('work.json')
        .then(response => response.json())
        .then(projectFiles => {
            const workButtonsContainer = document.getElementById('work-buttons');
            const workInfoContainer = document.getElementById('work-info');

            // Load all project files
            const projectPromises = projectFiles.map(file => fetch(`projects/${file}`).then(response => response.json()));
            Promise.all(projectPromises)
                .then(projectsData => {
                    fetch('tags.json')
                        .then(response => response.json())
                        .then(tagsData => {
                            // Render work buttons and info
                            projectsData.forEach((project, index) => {
                                const button = document.createElement('button');
                                button.classList.add('btn', 'btn-work', 'm-1', 'work-button');
                                button.innerHTML = `
                                    <div class="d-flex justify-content-between align-items-center">
                                        <div class="col-md-3 d-flex justify-content-center p-0">
                                            <img src="${project.logo}" alt="${project.title}" class="logo">
                                        </div>
                                        <div class="col-md-9 text-left">
                                            <p class="primary p-0 m-0">${project.position}</p>
                                            <p class="core p-0 m-0">${project.company}</p>
                                        </div>
                                    </div>
                                `;
                                button.addEventListener('click', () => showWorkInfo(index));
                                workButtonsContainer.appendChild(button);

                                const workInfo = document.createElement('div');
                                workInfo.classList.add('card');
                                workInfo.classList.add('work-info');
                                workInfo.style.display = index === 0 ? 'block' : 'none';
                                workInfo.innerHTML = `
                                    <div class="card-body">
                                        <h3 class="primary">${project.position}</h3>
                                        <p class="core">${project.company}</p>
                                        <p class="secondary">${project.period}</p>
                                        <p>${project.description}</p>
                                        <p class="secondary"><strong>What:</strong></p>
                                        <ul>${project.what.map(item => `<li>${item}</li>`).join('')}</ul>

                                        <p class="secondary"><strong>How:</strong></p>
                                        <ul>${project.how.map(item => `<li>${item}</li>`).join('')}</ul>

                                        <p class="secondary"><strong>Result:</strong></p>
                                        <ul>${project.result.map(item => `<li>${item}</li>`).join('')}</ul>
                                        <div class="project-tags">
                                            ${project.tags.map(tag => {
                                                const tagColor = Object.entries(tagsData).find(([category, { tags }]) => tags.includes(tag))[1].selected_colour;
                                                return `<span class="tag" style="color: ${tagColor};">#${tag}</span>`;
                                            }).join('')}
                                        </div>
                                    </div>
                                `;
                                workInfoContainer.appendChild(workInfo);
                            });
                        })
                        .catch(error => console.error('Error loading tags data:', error));
                })
                .catch(error => console.error('Error loading project data:', error));
        })
        .catch(error => console.error('Error loading data:', error));

    function showWorkInfo(index) {
        const workInfos = document.querySelectorAll('.work-info');
        workInfos.forEach((info, i) => {
            info.style.display = i === index ? 'block' : 'none';
        });
    }
});