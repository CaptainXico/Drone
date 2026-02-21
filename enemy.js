// ===============================
// Sprint with Shift
// ===============================
document.addEventListener("keydown", function (e) {
  let camera = document.querySelector("#camera");

  if (e.key === "Shift") {
    camera.setAttribute("wasd-controls", "acceleration", 400);
  }
});

document.addEventListener("keyup", function (e) {
  let camera = document.querySelector("#camera");

  if (e.key === "Shift") {
    camera.setAttribute("wasd-controls", "acceleration", 10);
  }
});


// ===============================
// Random spawn position
// ===============================
function getRandomPosition() {
  return {
    x: Math.random() * 20 - 10,
    y: Math.random() * 4 + 1,
    z: Math.random() * 20 - 10
  };
}


// ===============================
// Drone Follow Component
// ===============================
AFRAME.registerComponent('follow-camera', {
  schema: {
    speed: { type: 'number', default: 2 },
    attackDistance: { type: 'number', default: 1.5 }
  },

  init: function () {
    this.camera = document.querySelector('#camera');
    this.caught = false;
  },

  tick: function (time, timeDelta) {
    if (!this.el.getAttribute('visible')) return;
    if (!this.camera) return;

    const modelPos = this.el.object3D.position;
    const cameraPos = this.camera.object3D.position;

    // Direction toward camera
    const direction = new THREE.Vector3();
    direction.subVectors(cameraPos, modelPos);
    direction.normalize();

    // Smooth frame-based movement
    const moveAmount = this.data.speed * (timeDelta / 1000);
    modelPos.add(direction.multiplyScalar(moveAmount));

    // Hover effect (floating drone motion)
    modelPos.y += Math.sin(time / 300) * 0.002;

    // Always face the camera
    this.el.object3D.lookAt(cameraPos);

    // Attack detection
    const distance = modelPos.distanceTo(cameraPos);

    if (distance < this.data.attackDistance && !this.caught) {
      this.caught = true;
      alert("🚨 YOU GOT CAUGHT BY THE POLICE DRONE! 🚨");
    }
  }
});


// ===============================
// Setup on Load
// ===============================
window.onload = function () {

  const model = document.getElementById("cube");
  const controller = document.getElementById("controller");

  // Attach follow component
  model.setAttribute("follow-camera", "speed: 3; attackDistance: 1.5");

  // Shoot drone with controller
  controller.addEventListener("triggerdown", function () {

    // Hide drone
    model.setAttribute("visible", false);

    // Reset caught state
    model.components["follow-camera"].caught = false;

    // Respawn after 3 seconds
    setTimeout(function () {

      const newPosition = getRandomPosition();
      model.setAttribute("position", newPosition);
      model.setAttribute("visible", true);

    }, 3000);
  });
};
