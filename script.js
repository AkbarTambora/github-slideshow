document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.riasec-section');
    const nextButton = document.getElementById('next-btn');
    const prevButton = document.getElementById('prev-btn');
    const submitButton = document.getElementById('submit-btn');
    const riasecSectionsContainer = document.getElementById('riasec-sections');
    const resultsContainer = document.createElement('div');
    resultsContainer.id = 'results-container';
    document.querySelector('.container').appendChild(resultsContainer);

    let currentSectionIndex = 0;

    const careerSuggestions = {
        realistic: ["Electrician", "Mechanic", "Carpenter", "Farmer", "Pilot", "Forester", "Engineer"],
        investigative: ["Scientist", "Doctor", "Psychologist", "Researcher", "Analyst", "Detective", "Pharmacist"],
        artistic: ["Graphic Designer", "Musician", "Writer", "Actor", "Dancer", "Photographer", "Architect"],
        social: ["Teacher", "Counselor", "Social Worker", "Nurse", "Coach", "HR Specialist", "Therapist"],
        enterprising: ["Sales Manager", "Entrepreneur", "Lawyer", "Manager", "Promoter", "Stockbroker", "CEO"],
        conventional: ["Accountant", "Secretary", "Banker", "Librarian", "Office Manager", "Data Entry Clerk", "Financial Analyst"]
    };

    const userResponses = {
        realistic: [],
        investigative: [],
        artistic: [],
        social: [],
        enterprising: [],
        conventional: []
    };

    const scores = {
        realistic: 0,
        investigative: 0,
        artistic: 0,
        social: 0,
        enterprising: 0,
        conventional: 0
    };

    function showSection(index) {
        sections.forEach((section, i) => {
            section.style.display = i === index ? 'block' : 'none';
        });
        prevButton.style.display = index === 0 ? 'none' : 'inline-block';
        nextButton.style.display = index === sections.length - 1 ? 'none' : 'inline-block';
        submitButton.style.display = index === sections.length - 1 ? 'inline-block' : 'none';

        // Special handling for the first section
        if (index === 0) {
            prevButton.style.display = 'none';
        }
        // Special handling for the last section
        if (index === sections.length - 1) {
            nextButton.style.display = 'none';
            submitButton.style.display = 'inline-block';
        } else {
            submitButton.style.display = 'none';
        }
    }

    function collectResponses() {
        // This is a placeholder. Actual response collection will depend on input elements.
        // For now, let's simulate some responses for each section if inputs are not there.
        sections.forEach(section => {
            const type = section.id;
            const questionInputs = section.querySelectorAll('input[type="checkbox"]'); // Assuming checkboxes
            userResponses[type] = [];
            if (questionInputs.length > 0) {
                 questionInputs.forEach(input => {
                    if (input.checked) {
                        userResponses[type].push(input.value); // or simply true
                    }
                });
            } else {
                // Simulate if no inputs are present yet
                // This part would be removed/changed when actual inputs are added
                const numQuestions = section.querySelectorAll('li').length;
                for(let i=0; i < numQuestions; i++) {
                    // Simulate some "yes" answers randomly for demonstration
                    if (Math.random() > 0.5) {
                         userResponses[type].push(`question${i+1}_yes`);
                    }
                }
            }
        });
        console.log("Collected Responses:", userResponses);
    }

    function calculateScores() {
        for (const type in userResponses) {
            // Simple scoring: 1 point per "yes" or selected item.
            // This will need to be adjusted based on actual question/response structure.
            scores[type] = userResponses[type].length;
        }
        console.log("Calculated Scores:", scores);
    }

    function getDominantTypes() {
        let maxScore = 0;
        for (const type in scores) {
            if (scores[type] > maxScore) {
                maxScore = scores[type];
            }
        }
        const dominantTypes = [];
        for (const type in scores) {
            if (scores[type] === maxScore && maxScore > 0) {
                dominantTypes.push(type.charAt(0).toUpperCase() + type.slice(1));
            }
        }
        return dominantTypes;
    }

    function displayResults() {
        riasecSectionsContainer.style.display = 'none';
        prevButton.style.display = 'none';
        nextButton.style.display = 'none';
        submitButton.style.display = 'none';

        resultsContainer.innerHTML = '<h2>Test Results</h2>';
        const scoresList = document.createElement('ul');
        for (const type in scores) {
            const listItem = document.createElement('li');
            listItem.textContent = `${type.charAt(0).toUpperCase() + type.slice(1)}: ${scores[type]}`;
            scoresList.appendChild(listItem);
        }
        resultsContainer.appendChild(scoresList);

        const dominantTypes = getDominantTypes();
        const dominantTypeElement = document.createElement('p');
        if (dominantTypes.length > 0) {
            dominantTypeElement.innerHTML = `<strong>Dominant Type(s): ${dominantTypes.join(', ')}</strong>`;
        } else {
            dominantTypeElement.innerHTML = '<strong>No clear dominant type.</strong> You might have varied interests!';
        }
        resultsContainer.appendChild(dominantTypeElement);

        // Add career suggestions
        const careerSuggestionsTitle = document.createElement('h3');
        careerSuggestionsTitle.textContent = 'Career Suggestions:';
        resultsContainer.appendChild(careerSuggestionsTitle);

        const careerListElement = document.createElement('ul');
        careerListElement.id = 'career-suggestions-list';

        if (dominantTypes.length > 0) {
            dominantTypes.forEach(type => {
                const typeCareers = careerSuggestions[type.toLowerCase()];
                if (typeCareers && typeCareers.length > 0) {
                    const typeHeader = document.createElement('li');
                    typeHeader.innerHTML = `<strong>For ${type}:</strong>`;
                    typeHeader.style.listStyleType = 'none'; // No bullet for the header
                    typeHeader.style.marginTop = '10px';
                    careerListElement.appendChild(typeHeader);
                    typeCareers.forEach(career => {
                        const listItem = document.createElement('li');
                        listItem.textContent = career;
                        careerListElement.appendChild(listItem);
                    });
                }
            });
        } else {
            const listItem = document.createElement('li');
            listItem.textContent = 'Answer more questions to see career suggestions.';
            careerListElement.appendChild(listItem);
        }
        resultsContainer.appendChild(careerListElement);

        resultsContainer.style.display = 'block';
    }

    nextButton.addEventListener('click', () => {
        if (currentSectionIndex < sections.length - 1) {
            currentSectionIndex++;
            showSection(currentSectionIndex);
        }
    });

    prevButton.addEventListener('click', () => {
        if (currentSectionIndex > 0) {
            currentSectionIndex--;
            showSection(currentSectionIndex);
        }
    });

    submitButton.addEventListener('click', () => {
        collectResponses();
        calculateScores();
        displayResults();
    });

    // Initialize the first section
    showSection(0);
});
