import * as THREE from "three"

export default function getBgSphere({ hue = 0.565, lightnessMult = 0.015 } = {}) {
    const bgSphereGeo = new THREE.IcosahedronGeometry(4, 3);
    const bgSphereMat = new THREE.MeshBasicMaterial({
        side: THREE.BackSide,
        vertexColors: true,
        fog: false
    });
    // create an array of colors per vertex
    const bgSphereColors = [];
    const len = bgSphereGeo.attributes.position.count;
    for (let i = 0; i < len; i++) {
        const z = -bgSphereGeo.attributes.position.getZ(i);
        const x = bgSphereGeo.attributes.position.getX(i);
        const y = bgSphereGeo.attributes.position.getY(i);
        
        // Add some noise based on position 
        const noiseValue = Math.sin(x * 5) * Math.cos(y * 5) * 0.1;
        
        const { r, g, b } = new THREE.Color().setHSL(
            (hue + noiseValue) % 1.0,
            1,
            z * lightnessMult + 0.2
        );
        bgSphereColors.push(r, g, b);
    }
    bgSphereGeo.setAttribute('color', new THREE.Float32BufferAttribute(bgSphereColors, 3));
    const bgSphere = new THREE.Mesh(bgSphereGeo, bgSphereMat);

    return bgSphere;
}