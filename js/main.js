// script for generating buildings / game logic etc
const catsNumber = getRandomInt(50);
let catsWinNumber  = catsNumber;
const totalTime  = catsNumber*5;
let cats = [];

window.onload = function() {
    createTrees();
    const playBtn = document.getElementById("playBtn");
    const Win = document.getElementById("Win");
    playBtn.addEventListener('click',beginGame);
};

function beginGame(){
    let time = 0;

    const timeLeft = document.getElementById('timeLeft');
    const totalTimeElm = document.getElementById('totalTime');
    const cubesCreated = document.getElementById('cubesCreated');
    const cubesLeft= document.getElementById('cubesLeft');
    const cubesTotal= document.getElementById('totalCubes');

    createCats(cats);
    cubesCreated.innerHTML=catsNumber.toString();
    cubesTotal.innerHTML=catsWinNumber.toString();
    totalTimeElm.innerHTML=totalTime.toString();

    // document.getElementById('myAudio').play();
    // document.getElementById('myAudio').volume = 0.5;
    playBtn.style.visibility = "hidden";
    updateGameState(time,cats);
}

function restart(){
    location.reload();
}


function  updateGameState(time, cats){

    setInterval(function(){
        time++;
        timeLeft.innerHTML=time;
        cubesLeft.innerHTML= catsWinNumber;
        console.log(time,  catsWinNumber);
        if (time===totalTime){
            restart();
        }

    }, 1000);
    setInterval(function(){
        movementLoop(cats)
    }, 1000);

}

function createTrees() {
    let i;
    for (i = 0; i < 70 ; i++) {
        let tree = document.createElement('a-entity');
        tree.setAttribute('gltf-model', '#treemodel');
        console.log("created tree");

        //random position for the cat
        let Treeposx =getRandomInt(400);
        let Treeposz =getRandomInt(800);
        let Treescale =getRandomInt(2);
        //set position and other attibutes
        tree.setAttribute('position', {x: Treeposx, y: 0, z:  Treeposz});
        tree.object3D.scale.set(1,1 , 1);
        tree.setAttribute('class', 'tree');
        // cat.setAttribute('material', 'src', 'cat.jpg');
        // cat.setAttribute('material', 'color', 'black');
        // cat.setAttribute('physics-body', 'mass', '90');
        document.querySelector('a-scene').appendChild(tree);
        tree.setAttribute('static-body', '')
        // set dynamic body
        // cat.setAttribute('body', {type: "dynamic"})
    }
    console.log(cats)
}

function createCats(cats) {
    let i;
    for (i = 0; i < catsNumber ; i++) {
        let cat = document.createElement('a-entity');
        cat.setAttribute('gltf-model', '#catmodel');
        console.log("created cat");

        //random position for the cat
        let posx =getRandomInt(100);
        let posz =getRandomInt(50);

        //set position and other attibutes
        cat.setAttribute('position', {x: posx, y: 1, z: posz});
        cat.object3D.scale.set(0.025,0.025, 0.025);
        cat.setAttribute('id','cat'+i);
        cat.setAttribute('class', 'cat');
        // cat.setAttribute('material', 'src', 'cat.jpg');
        cat.setAttribute('material', 'color', '#fff');
        cat.setAttribute('physics-body', 'mass', '90');
        document.querySelector('a-scene').appendChild(cat);
        cat.setAttribute('dynamic-body', '')
        cats.push('cat'+i);
        // set dynamic body
        // cat.setAttribute('body', {type: "dynamic"})
    }
    console.log(cats)
}

function movementLoop(){

    for (i = 0; i < cats.length ; i++) {
        // console.log("m loop ran"+'cat'+i);
        let el = document.getElementById('cat'+i);
        let elVec = el.object3D.position;
        let elRot = el.object3D.rotation;

        let posx =getRandomInt(2);
        let posz =getRandomInt(2);

        let rotx =getRandomInt(180);
        let rotz =getRandomInt(180);

        el.setAttribute('position', {
            x: elVec.x += posx,
            y: elVec.y + 0,
            z: elVec.z += posz});

        setInterval(function(){
            el.setAttribute('rotation', {
                x: elRot.x + 0,
                y: elRot.y += rotx,
                z: elRot.z +0.025});
        }, 5000);
        if (el.components["dynamic-body"]) {
            el.components["dynamic-body"].syncToPhysics()
        }
    }
}


AFRAME.registerComponent('player', {
    init: function() {
        this.el.addEventListener('collide', function(e) {
            console.log('Player has collided with ', e.detail.body.el);
            e.detail.target.el; // Original entity (playerEl).
            e.detail.body.el; // Other entity, which playerEl touched.
            e.detail.contact; // Stats about the collision (CANNON.ContactEquation).
            e.detail.contact.ni; // Normal (direction) of the collision (CANNON.Vec3).
            console.log('NAME'+e.detail.body.el.className);

            if (e.detail.body.el.className=== "cat")
            {
                const catId = e.detail.body.el.id;
                console.log(catId)
                // const filteredCat = cats.filter(item => item !== catId )
                const id = cats.indexOf(catId); // 2
                const removedCat = cats.splice(id,  1);

                console.log("removed"+removedCat+"from+")
                console.table(cats);
                const cat = document.querySelector('a-entity');
                let catRemove = e.detail.body.el;
                cat.parentNode.removeChild(catRemove);
                document.getElementById('pickup').play();
                decrementScore();
            }

        });
    }
})

AFRAME.registerComponent ("cat", {
    init: function () {
        this.direction = new THREE.Vector3(0.0, 0.01, 0.0);
    },

    tick: function (time) {
        var el = this.el;
        var direction = this.direction;
        var elVec = el.object3D.position;
        var elRot = el.object3D.rotation;

        let posx =getRandomInt(2);
        let posz =getRandomInt(2);

        let rotx =getRandomInt(90);
        let rotz =getRandomInt(180);

        el.setAttribute('position', {
            x: elVec.x += 0.025,
            y: elVec.y + 0,
            z: elVec.z += 0.025});

        setInterval(function(){
        el.setAttribute('rotation', {
            x: elRot.x + 0,
            y: elRot.y += rotx,
            z: elRot.z +0.025});
        }, 5000);
        if (el.components["dynamic-body"]) {
            el.components["dynamic-body"].syncToPhysics()
        }

    }
});




function decrementScore(){
    catsWinNumber--;

    //check for win condition
    if (catsWinNumber===0){
        document.getElementById("Win").style.visibility = "visible";
        document.getElementById("restart").addEventListener('click',restart);
        console.log("Win Condition met");
    }

}