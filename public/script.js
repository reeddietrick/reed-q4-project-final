// Function to update service projects
async function updateCaps() {
    try {
        const response = await fetch('/api/caps');
        if (response.ok) {
            const caps = await response.json();
            const container = document.querySelector('.gallery');
            container.innerHTML = '';

            caps.forEach(cap => {
                const projectCard = document.createElement('div');
                projectCard.classList.add('project-card');
                projectCard.dataset.id = cap._id;
                
                projectCard.innerHTML = `
                    <h2>${cap.title}</h2>
                    <p>${cap.description}</p>
                    <p><strong>Author:</strong> ${cap.author}</p>
                    <p><strong>Year:</strong> ${cap.year}</p>
                    <p><strong>Category:</strong> ${cap.category}</p>
                    <button class="btn edit-btn" data-id="${cap._id}">Edit</button>
                    <form action="/delete-cap/${cap._id}" method="POST" class="delete-form">
                        <button type="submit" class="btn">Delete</button>
                    </form>
                `;
                
                container.appendChild(projectCard);
            });
        } else {
            console.error('Response not ok with status:', response.status);
        }
    } catch (error) {
        console.error('Fetch error:', error.message);
    }
}

// Call the updateCaps function when the page loads
updateCaps();
