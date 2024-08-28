document.addEventListener('DOMContentLoaded', () => {
    const carDataDiv = document.getElementById('carData');
    const advancedCarDataDiv = document.getElementById('advancedCarData');
    const tokenInput = document.getElementById('tokenInput');
    const getCarDataButton = document.getElementById('getCarDataButton');
    const getAdvancedDataButton = document.getElementById('getAdvancedDataButton');
    const getRewardsHistoryButton = document.getElementById('getRewardsHistoryButton');
    const shareTwitterButton = document.getElementById('shareTwitterButton');
    const viewOnPolygonScanButton = document.getElementById('viewOnPolygonScanButton');
    const loginPage = document.getElementById('loginPage');
    const carDataPage = document.getElementById('carDataPage');
    const backButton = document.getElementById('backButton');

    const searchInput = document.getElementById('deviceSearchInput');
    const autocompleteList = document.getElementById('autocompleteList');

    let carData = null;



const showSection = (section) => {
    carDataDiv.style.display = 'none';
    advancedCarDataDiv.style.display = 'none';

    if (section === 'overview') {
        carDataDiv.style.display = 'block';
    } else if (section === 'attributes') {
        advancedCarDataDiv.style.display = 'block';
    }
};

const setActiveButton = (buttonId) => {
    const buttons = document.querySelectorAll('.button-group button');
    buttons.forEach(button => {
        button.classList.remove('active');
    });
    document.getElementById(buttonId).classList.add('active');
};


const overviewButton = document.getElementById('overviewButton');
overviewButton.addEventListener('click', () => {
    showSection('overview');
    setActiveButton('overviewButton');
});




   

    const fetchCarData = async (tokenId) => {
        try {
            console.log('Fetching data for Token ID:', tokenId);
            const response = await fetch('/fetchCarData', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ tokenId }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                carDataDiv.innerHTML = `<p>Error: ${errorText}</p>`;
                return;
            }

            carData = await response.json();

            carDataDiv.innerHTML = `
                <p><strong>ID:</strong> ${carData.id}</p>
                <p><strong>Name:</strong> ${carData.name}</p>
                <p><strong>Owner:</strong> ${carData.owner}</p>
                <a href="https://polygonscan.com/address/${carData.owner}" class="icon-link" target="_blank"><i class="fa-solid fa-link"></i></a>
                <p><strong>Minted At:</strong> ${carData.mintedAt ? carData.mintedAt : 'N/A'}</p>
                <p><strong>DCN Name:</strong> ${carData.dcn ? carData.dcn.name : 'N/A'}</p>
                <p><strong>Total Tokens:</strong> ${carData.earnings ? carData.earnings.totalTokens : 'N/A'}</p>
                <p><strong>Make:</strong> ${carData.definition ? carData.definition.make : 'N/A'}</p>
                <p><strong>Model:</strong> ${carData.definition ? carData.definition.model : 'N/A'}</p>
                <p><strong>Year:</strong> ${carData.definition ? carData.definition.year : 'N/A'}</p>
                <p><strong>Definition ID:</strong> ${carData.definition ? carData.definition.id : 'N/A'}</p>
            `;
            shareTwitterButton.style.display = 'block';
            viewOnPolygonScanButton.style.display = 'block';
            getRewardsHistoryButton.style.display = 'block';

            if (carData.definition && carData.definition.id) {
                getAdvancedDataButton.style.display = 'block';
            } else {
                getAdvancedDataButton.style.display = 'none';
            }

            loginPage.style.display = 'none';
            carDataPage.style.display = 'flex';

            showSection('overview');
            setActiveButton('overviewButton');
        } catch (error) {
            carDataDiv.innerHTML = `<p>Error fetching data: ${error.message}</p>`;
        }
    };

    const fetchAdvancedCarData = async (definitionId) => {
        try {
            console.log('Fetching advanced data for Definition ID:', definitionId);
            const response = await fetch('/fetchAdvancedCarData', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ definitionId: String(definitionId) }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                advancedCarDataDiv.innerHTML = `<p>Error: ${errorText}</p>`;
                return;
            }

            const advancedData = await response.json();

            advancedCarDataDiv.innerHTML = `
                <h2>Vehicle Attributes</h2>
                ${advancedData.attributes.map(attr => `<p><strong>${attr.name}:</strong> ${attr.value}</p>`).join('')}
            `;
            setActiveButton('getAdvancedDataButton');
        } catch (error) {
            advancedCarDataDiv.innerHTML = `<p>Error fetching advanced data: ${error.message}</p>`;
        }
    };

    const fetchRewardsHistory = async (tokenId) => {
        try {
            console.log('Fetching rewards history for Token ID:', tokenId);
            const response = await fetch('/fetchRewardsHistory', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ tokenId }),
            });
    
            if (!response.ok) {
                const errorText = await response.text();
                advancedCarDataDiv.innerHTML = `<p>Error: ${errorText}</p>`;
                return;
            }
    
            const earningsData = await response.json();
            console.log(earningsData);  
    
            const totalTokens = earningsData.totalTokens ? earningsData.totalTokens : 'N/A';
    
            advancedCarDataDiv.innerHTML = `
                <h2>Rewards History</h2>
                <p><strong>Total Tokens:</strong> ${totalTokens}</p>
                ${earningsData.history.edges.map(edge => `
                    <p><strong>Week:</strong> ${edge.node.week}</p>
                    <p><strong>Connection Streak:</strong> ${edge.node.connectionStreak}</p>
                    <p><strong>Streak Tokens:</strong> ${edge.node.streakTokens}</p>
                    <p><strong>Aftermarket Device Tokens:</strong> ${edge.node.aftermarketDeviceTokens}</p>
                `).join('')}
            `;
            setActiveButton('getRewardsHistoryButton');
        } catch (error) {
            advancedCarDataDiv.innerHTML = `<p>Error fetching rewards history: ${error.message}</p>`;
        }
    };
    



    const shareOnTwitter = () => {
        const tweetText = `Check out this car on DIMO: ${carData.name}. View more details at https://example.com/token/${carData.id}`;
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
        window.open(twitterUrl, '_blank');
    };

    const viewOnPolygonScan = () => {
        const polygonScanUrl = `https://polygonscan.com/address/${carData.owner}`;
        window.open(polygonScanUrl, '_blank');
    };

    getCarDataButton.addEventListener('click', () => {
        const tokenId = tokenInput.value;
        if (tokenId) {
            fetchCarData(tokenId);
            window.history.pushState({}, '', `/token/${tokenId}`);
        }
    });

    getAdvancedDataButton.addEventListener('click', () => {
        if (carData && carData.definition && carData.definition.id) {
            fetchAdvancedCarData(carData.definition.id);
            showSection('attributes');
        }
    });

    getRewardsHistoryButton.addEventListener('click', () => {
        const tokenId = tokenInput.value;
        if (tokenId) {
            fetchRewardsHistory(tokenId);
            showSection('attributes');
        }
    });
    shareTwitterButton.addEventListener('click', () => {
        shareOnTwitter();
    });

    viewOnPolygonScanButton.addEventListener('click', () => {
        viewOnPolygonScan();
    });

    backButton.addEventListener('click', () => {
        carDataPage.style.display = 'none';
        loginPage.style.display = 'flex';
    });

    const tokenId = window.location.pathname.split('/').pop();
    if (tokenId && tokenId !== 'token') {
        tokenInput.value = tokenId;
        fetchCarData(tokenId);
    }




const fetchTokenIds = async (definitionId) => {
    try {
     
        const formattedDefinitionId = `"${definitionId}"`;
        
        console.log('Fetching token IDs for Definition ID:', formattedDefinitionId);

        const response = await fetch('/fetchTokenIds', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ definitionId: formattedDefinitionId }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            autocompleteList.innerHTML = `<li>Error: ${errorText}</li>`;
            return;
        }

        const tokenData = await response.json();

    
    
        autocompleteList.innerHTML = '';
        if (tokenData.length > 0) {
            tokenData.forEach(item => {
                const listItem = document.createElement('li');
                listItem.textContent = `Token ID: ${item.tokenId}`;
                listItem.classList.add('autocomplete-item');

                listItem.addEventListener('click', () => {
                    window.location.href = `/token/${item.tokenId}`;
                });

                autocompleteList.appendChild(listItem);
            });
        } else {
            autocompleteList.innerHTML = '<li>No tokens found</li>';
        }
        autocompleteList.style.display = 'block';
    } catch (error) {
        console.error('Error fetching token IDs:', error);
    }
};




searchInput.addEventListener('input', async (e) => {
    const query = e.target.value.trim();

    if (query.length >= 2) {
        try {
            const response = await fetch(`/searchDeviceDefinitions?query=${encodeURIComponent(query)}`);
            const results = await response.json();

            autocompleteList.innerHTML = '';

            if (results && results.length > 0) {
                results.forEach(item => {
                    const listItem = document.createElement('li');
                    listItem.textContent = `${item.name} `;
                    listItem.classList.add('autocomplete-item');

                    listItem.addEventListener('click', () => {
                        fetchTokenIds(item.id);
                    });

                    autocompleteList.appendChild(listItem);
                });
                autocompleteList.style.display = 'block';
            } else {
                autocompleteList.style.display = 'none';
            }
        } catch (error) {
            console.error('Error fetching autocomplete data:', error);
        }
    } else {
        autocompleteList.style.display = 'none';
    }
});
 
    function displayTokenList(tokenList) {
        autocompleteList.innerHTML = ''; 
        tokenList.forEach(tokenId => {
            const listItem = document.createElement('li');
            listItem.textContent = `Token ID: ${tokenId}`;
            listItem.classList.add('autocomplete-item');
    
            listItem.addEventListener('click', () => {
                window.location.href = `/token/${tokenId}`;
            });
    
            autocompleteList.appendChild(listItem);
        });
        autocompleteList.style.display = 'block';
    }
});


document.addEventListener('DOMContentLoaded', () => {
    
    const githubButton = document.getElementById('githubButton');
    githubButton.addEventListener('click', () => {
        window.open('https://github.com/DIMO-Network/vehicle-info-web', '_blank');
    });

   
});

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('ownerSearchInput');
    const autocompleteList = document.getElementById('ownerAutocompleteList');

    const fetchTokenIdsByOwner = async (ownerAddress) => {
        try {
            console.log('Fetching token IDs for Owner Address:', ownerAddress);

            const response = await fetch('/fetchTokenIdsByOwner', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ownerAddress }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                autocompleteList.innerHTML = `<li>Error: ${errorText}</li>`;
                return;
            }

            const tokenData = await response.json();

            autocompleteList.innerHTML = '';
            if (tokenData.length > 0) {
                tokenData.forEach(item => {
                    const listItem = document.createElement('li');
                    listItem.textContent = `Token ID: ${item.tokenId}`;
                    listItem.classList.add('autocomplete-item');

                    listItem.addEventListener('click', () => {
                        window.location.href = `/token/${item.tokenId}`;
                    });

                    autocompleteList.appendChild(listItem);
                });
            } else {
                autocompleteList.innerHTML = '<li>No tokens found</li>';
            }
            autocompleteList.style.display = 'block';
        } catch (error) {
            console.error('Error fetching token IDs:', error);
        }
    };

    searchInput.addEventListener('input', async (e) => {
        const query = e.target.value.trim();

        if (query.length >= 2) {
            fetchTokenIdsByOwner(query);
        } else {
            autocompleteList.style.display = 'none';
        }
    });
});
