document.addEventListener('DOMContentLoaded', async () => {
    const vehicleList = document.getElementById('vehicleList');
    const urlParams = new URLSearchParams(window.location.search);
    const deviceDefinitionId = urlParams.get('deviceDefinitionId');

    if (deviceDefinitionId) {
        try {
            const response = await fetch('/fetchVehicles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ deviceDefinitionId }),
            });

            const data = await response.json();
            vehicleList.innerHTML = '';  // Clear previous results

            data.nodes.forEach(vehicle => {
                const listItem = document.createElement('li');
                listItem.textContent = `${vehicle.name} (${vehicle.tokenId}) - ${vehicle.earnings.totalTokens} Tokens`;
                listItem.className = 'vehicle-item';
                listItem.addEventListener('click', () => {
                    window.location.href = `/token/${vehicle.tokenId}`;
                });
                vehicleList.appendChild(listItem);
            });
        } catch (error) {
            console.error('Error fetching vehicles:', error);
        }
    }
});
