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
                                button.classList.add('btn', 'btn-work', 'work-button', "btn-block");
                                button.innerHTML = `
                                    <div class="row align-items-center">
                                        <div class="col-3 p-2 pl-3">
                                            <img src="${project.logo}" alt="${project.title}" class="logo img-fluid">
                                        </div>
                                        <div class="col-9 text-left">
                                            <p class="primary p-0 m-0">${project.position}</p>
                                            <p class="core p-0 m-0">${project.company}</p>
                                        </div>
                                    </div>
                                `;
                                button.addEventListener('click', () => showWorkInfo(index));
                                workButtonsContainer.appendChild(button);

                                const workInfo = document.createElement('div');
                                workInfo.classList.add('card', 'work-info');
                                if (index !== 0) workInfo.style.display = 'none'; // Hide all except the first one
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

    let isTransitioning = false;
    let lastActiveIndex = 0;

    function showWorkInfo(index) {
        if (isTransitioning) return; // Ignore clicks during transition
        if (index === lastActiveIndex) return; // Ignore clicks on the active work info
        isTransitioning = true; // Set the flag to indicate a transition is in progress
    
        const workInfos = document.querySelectorAll('.work-info');
        const workInfoContainer = document.getElementById('work-info');
    
        // Get the current height of the container
        const currentHeight = workInfoContainer.offsetHeight;
    
        // Hide the currently active work info with a transition
        const activeInfo = Array.from(workInfos).find(info => info.style.display === 'block');
        if (activeInfo) {
            activeInfo.style.transition = 'opacity 0.2s, transform 0.2s';
            activeInfo.style.opacity = 0;
            activeInfo.style.transform = 'translateX(-30%)';
        }
    
        // After the hide transition, show the new work info
        setTimeout(() => {
            if (activeInfo) activeInfo.style.display = 'none';
    
            // Show the selected work info and get its height
            workInfos.forEach((info, i) => {
                if (i === index) {
                    info.style.display = 'block';
                    info.style.opacity = 0;
                    info.style.transform = 'translateX(-30%)';
                } else {
                    info.style.display = 'none';
                }
            });
    
            // Get the new height of the container
            const newHeight = workInfos[index].offsetHeight;
    
            // Set the container height to the current height and then transition to the new height
            workInfoContainer.style.height = `${currentHeight}px`;
            setTimeout(() => {
                workInfoContainer.style.transition = 'height 0.5s ease';
                workInfoContainer.style.height = `${newHeight}px`;
            }, 200);
    
            // Transition the opacity and transform of the selected work info
            setTimeout(() => {
                workInfos[index].style.transition = 'opacity 0.2s, transform 0.2s';
                workInfos[index].style.opacity = 1;
                workInfos[index].style.transform = 'translateX(0)';
            }, 200);
    
            // Remove the height transition after it's done
            setTimeout(() => {
                workInfoContainer.style.transition = '';
                workInfoContainer.style.height = '';
                isTransitioning = false; // Reset the flag after the transition is complete
            }, 400);
        }, 200); // Match this timeout with the hide transition duration

        lastActiveIndex = index;
    }
    

});