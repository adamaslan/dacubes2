import * as THREE from 'three';

function getBgSphere({ hue = 0.6 }) {
  const bgGeometry = new THREE.SphereGeometry(50, 32, 32);
  const bgMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color().setHSL(hue, 0.8, 0.1),
    side: THREE.BackSide,
  });
  const bgSphere = new THREE.Mesh(bgGeometry, bgMaterial);
  return bgSphere;
}

export default getBgSphere;