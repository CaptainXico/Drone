// ===============================
// Sprint with Shift
// ===============================
document.addEventListener("keydown", function (e) {
  const camera = document.querySelector("#camera");
  if (e.key === "Shift") {
    camera.setAttribute("wasd-controls", "acceleration", 400);
  }
});

document.addEventListener("keyup", function (e) {
  const camera = document.querySelector("#camera");
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
    y: 2,
    z: Math.random() * 20 - 10
  };
}


// ===============================
// Smooth Follow Component
// ===============================
AFRAME.registerComponent("follow-camera", {
  schema: {
    speed: { type: "number", default: 2 },
    stopDistance: { type: "number", default: 2 }
  },

  init: function () {
    this.camera = document.querySelector("#camera");
    this.direction = new THREE.Vector3();
  },

  tick: function (time, timeDelta) {
    if (!this.el.getAttribute("visible")) return;
    if (!this.camera) return;

    const drone = this.el.object3D;
    const cam = this.camera.object3D;

    const dronePos = drone.position;
    const camPos = cam.position;

    // Direction to player
    this.direction.subVectors(camPos, dronePos);

    const distance = this.direction.length();

    // Stop when close
    if (distance > this.data.stopDistance) {
      this.direction.normalize();

      const moveAmount = this.data.speed * (timeDelta / 1000);
      dronePos.add(this.direction.multiplyScalar(moveAmount));
    }

    // Smooth hover (stable)
    dronePos.y = 2 + Math.sin(time * 0.002) * 0.3;

    // Smoothly rotate toward camera (Y axis only)
    const angle = Math.atan2(
      camPos.x - dronePos.x,
      camPos.z - dronePos.z
    );

    drone.rotation.y = angle;
  }
});


// ===============================
// Setup
// ===============================
window.onload = function () {
  const drone = document.getElementById("cube");
  const controller = document.getElementById("controller");

  drone.setAttribute("follow-camera", "speed: 3; stopDistance: 2");

  controller.addEventListener("triggerdown", function () {
    drone.setAttribute("visible", false);

    setTimeout(function () {
      drone.setAttribute("position", getRandomPosition());
      drone.setAttribute("visible", true);
    }, 3000);
  });
};
