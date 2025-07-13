const isLoggedIn = localStorage.getItem('isLoggedIn');
    const role = localStorage.getItem('role');
    const email = localStorage.getItem('username');

    if (
      isLoggedIn !== 'true' ||
      role !== 'admin' ||
      email !== 'prasaisajjan2020@gmail.com'
    ) {
      alert("Access denied. Only authorized admin can access this page.");
      window.location.href = 'index.html';
    }

    function logoutAdmin() {
      localStorage.removeItem('username');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('role');
      window.location.href = 'indexsigninsignup.html';
    }

    function loadCampaigns() {
      const campaigns = JSON.parse(localStorage.getItem('campaigns')) || [];
      const pendingList = document.getElementById('pendingCampaignList');
      const approvedList = document.getElementById('approvedCampaignList');
      pendingList.innerHTML = '';
      approvedList.innerHTML = '';

      campaigns.forEach((c, i) => {
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `
          <h3>${c.title}</h3>
          <p>${c.description}</p>
          <p><strong>Posted by:</strong> ${c.name} (${c.userType}, ${c.email})</p>
          <p><em>Submitted on:</em> ${c.datePosted}</p>
        `;

        if (c.approved) {
          div.innerHTML += `<button onclick="deleteCampaign(${i})">Delete</button>`;
          approvedList.appendChild(div);
        } else {
          div.innerHTML += `
            <button onclick="approveCampaign(${i})">Approve</button>
            <button onclick="deleteCampaign(${i})">Delete</button>
          `;
          pendingList.appendChild(div);
        }
      });
    }

    function approveCampaign(index) {
      const campaigns = JSON.parse(localStorage.getItem('campaigns')) || [];
      campaigns[index].approved = true;
      localStorage.setItem('campaigns', JSON.stringify(campaigns));
      loadCampaigns();
    }

    function deleteCampaign(index) {
      let campaigns = JSON.parse(localStorage.getItem('campaigns')) || [];
      campaigns.splice(index, 1);
      localStorage.setItem('campaigns', JSON.stringify(campaigns));
      loadCampaigns();
    }

    window.addEventListener('DOMContentLoaded', loadCampaigns);