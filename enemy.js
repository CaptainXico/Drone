document.addEventListener("keydown", function (e) {
  let camera = document.querySelector("#camera");

  if (e.key == "Shift") {
    camera.setAttribute("wasd-controls", "acceleration", 400);
  }
});

document.addEventListener("keyup", function (e) {
  let camera = document.querySelector("#camera");

  if (e.key == "Shift") {
    camera.setAttribute("wasd-controls", "acceleration", 10);
  }
});

// Function to generate a random position
function getRandomPosition() {
  var x = Math.random() * 20 - 10; // Random x between -10 and 10
  var y = Math.random() * 5; // Random y between 0 and 5
  var z = Math.random() * 20 - 10; // Random z between -10 and 10
  return { x: x, y: y, z: z };
}

// Function to update the model's position smoothly
function moveModelToCamera(model, camera) {
  var cameraPosition = camera.getAttribute('position');
  var modelPosition = model.getAttribute('position');
  
  var dx = (cameraPosition.x - modelPosition.x) * 0.05;
  var dy = (cameraPosition.y - modelPosition.y) * 0.05;
  var dz = (cameraPosition.z - modelPosition.z - 2) * 0.05; // Offset to keep the model in front of the camera

  var newPosition = {
    x: modelPosition.x + dx,
    y: modelPosition.y + dy,
    z: modelPosition.z + dz
  };

  model.setAttribute('position', newPosition);
  model.setAttribute('look-at', '#camera'); // Make the model face the camera
}

window.onload = function () {
  // Get the model and camera elements
  var model = document.getElementById("cube");
  var camera = document.getElementById("camera");

  // Add event listener for controller button press
  var controller = document.getElementById("controller");
  controller.addEventListener("triggerdown", function () {
    // Make the model invisible
    model.setAttribute("visible", false);

    // Set a timeout to respawn the model after 3 seconds
    setTimeout(function() {
      // Get a random position
      var newPosition = getRandomPosition();

      // Place the model at the random position and make it visible
      model.setAttribute('position', newPosition);
      model.setAttribute('visible', true);

      // Start updating the model's position towards the camera
      clearInterval(model.followInterval);
      model.followInterval = setInterval(function() {
        moveModelToCamera(model, camera);
      }, 100); // Update every 100 milliseconds
    }, 3000); // 3000 milliseconds = 3 seconds
  });
};
