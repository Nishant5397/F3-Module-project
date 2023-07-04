function getUserInfo() {
  // Retrieve user's IP address using an API
  fetch("https://api.ipify.org/?format=json")
    .then((res) => res.json())
    .then((data) => {
      let ipAddress = data.ip;

      // Fetch additional information based on the IP address
      fetch(`https://ipinfo.io/${ipAddress}?token=a65aa5704d8782`)
        .then((response) => response.json())
        .then((data) => {
          const ip = data.ip;
          const lat = data.loc.split(",")[0];
          const lon = data.loc.split(",")[1];
          const timezone = data.timezone;
          const pincode = data.postal;

          // Display location on a map
          showLocationOnMap(lat, lon, data);

          // Show timezone information
          showTimezone(timezone, pincode);

          // Get and display post offices based on pincode
          getPostOffices(pincode);
        })
        .catch((error) => {
          console.log("Error:", error);
        });
    });
}

function showLocationOnMap(lat, lon, data) {
  const mapDiv = document.getElementById("map");
  mapDiv.classList.add("map");

  // Generate map URL and embed it in an iframe
  const mapUrl = `<iframe src="https://maps.google.com/maps?q=${lat}, ${lon}&z=15&output=embed" width="100%" height="100%"></iframe>`;

  const btn = document.querySelector("#btn");
  btn.classList.add("removeBtn");

  const ipDetails = document.querySelector(".ipDetails");

  // Display location details
  ipDetails.innerHTML += `
    <ul>
      <li>Lat: ${lat}</li>
      <li>Long: ${lon}</li>
    </ul>
    <ul>
      <li>City: ${data.city}</li>
      <li>Region: ${data.region}</li>
    </ul>
    <ul>
      <li>Organisation: ${data.org}</li>
      <li>Hostname: ${data.timezone}</li>
    </ul>
  `;

  // Display the map
  mapDiv.innerHTML = mapUrl;
}

function showTimezone(timezone, pincode) {
  var pincodeCount = 0;

  // Fetch pincode data to count the number of post offices found
  fetch(`https://api.postalpincode.in/pincode/${pincode}`)
    .then((response) => response.json())
    .then((data) => {
      const postOffices = data[0].PostOffice;
      postOffices.forEach((element) => {
        pincodeCount++;
      });

      const timezoneElement = document.getElementById("timezone");

      // Get the current time in the specified timezone
      let currentTime = new Date().toLocaleString("en-US", {
        timeZone: timezone,
      });

      // Display timezone information
      timezoneElement.innerHTML += `
        <h3>Time Zone: ${timezone}</h3>
        <h3>Date and Time: ${currentTime}</h3>
        <h3>Pincode: ${pincode}</h3>
        <h3>Message: Number of pincode(s) found: ${pincodeCount}</h3>
      `;
    });
}

function getPostOffices(pincode) {
  // Fetch post office data based on the pincode
  fetch(`https://api.postalpincode.in/pincode/${pincode}`)
    .then((response) => response.json())
    .then((data) => {
      const postOffices = data[0].PostOffice;

      const postOfficeList = document.getElementById("postOfficeList");

      // Display each post office's details
      postOffices.forEach((postOffice) => {
        postOfficeList.innerHTML += `
          <ul>
            <li>Name: ${postOffice.Name}</li>
            <li>Branch Type: ${postOffice.BranchType}</li>
            <li>Delivery Status: ${postOffice.DeliveryStatus}</li>
            <li>District: ${postOffice.District}</li>
            <li>Division: ${postOffice.Division}</li>
          </ul>
        `;
      });

      const searchBar = document.getElementById("searchBoxed");

      // Add a search box for filtering post offices
      searchBar.innerHTML += `
        <input
          type="text"
          id="searchBox"
          placeholder="Filter"
          oninput="filterPostOffices()"
        />
      `;
    })
    .catch((error) => {
      console.log("Error:", error);
    });
}

function filterPostOffices() {
  const searchBox = document.getElementById("searchBox");

  const filter = searchBox.value.toUpperCase();
  const postOfficeList = document.getElementById("postOfficeList");
  const listItems = postOfficeList.getElementsByTagName("ul");

  // Filter the post offices based on the search box input
  for (let i = 0; i < listItems.length; i++) {
    const listItem = listItems[i];
    const text = listItem.textContent || listItem.innerText;
    if (text.toUpperCase().indexOf(filter) > -1) {
      listItem.style.display = "";
    } else {
      listItem.style.display = "none";
    }
  }
}
