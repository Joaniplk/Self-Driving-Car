const canvas = document.getElementById('MainCanvas');
canvas.width = 200;
const networkcanvas = document.getElementById('networkCanvas');
networkcanvas.width = 300;
const ctx = canvas.getContext("2d");
const NetworkCtx = networkcanvas.getContext("2d");
const road = new Road(canvas.width / 2, canvas.width* 0.9); 
const N = 25; // Number of cars with AI
const cars = generateCars(N);
let bestCar = cars[0];
if(localStorage.getItem("bestBrain")){
    bestCar.brain = JSON.parse(
    localStorage.getItem("bestBrain"));
    console.log(localStorage.getItem("bestBrain"));
}
const traffic = [
    new Car(road.getLaneCenter(1),-100,30,50, "DUMMY", 2),
    new Car(road.getLaneCenter(0),-300,30,50, "DUMMY", 2),
    new Car(road.getLaneCenter(2),-300,30,50, "DUMMY", 2),
    new Car(road.getLaneCenter(1),-100,30,50, "DUMMY", 2),
    new Car(road.getLaneCenter(2),-500,30,50, "DUMMY", 2),
    new Car(road.getLaneCenter(1),-650,30,50, "DUMMY", 2.3),
    new Car(road.getLaneCenter(0),-800,30,50, "DUMMY", 1),
    new Car(road.getLaneCenter(2),-850,30,50, "DUMMY", 2.5),
    new Car(road.getLaneCenter(1),-850,30,50, "DUMMY", 2.1),
    new Car(road.getLaneCenter(0),-1000,30,50, "DUMMY", 1.7),
    new Car(road.getLaneCenter(1),-1000,30,50, "DUMMY", 1.4)
];
animate();
function save(){
    localStorage.setItem("bestBrain",
        JSON.stringify(bestCar.brain));
}
function discard(){
    localStorage.removeItem("bestBrain");
}
function generateCars(N){
    const cars = [];
    for(let i = 1; i <= N; i++){
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"))
    }
    return cars;
}
function animate(time){
    for(let i=0;i<traffic.length;i++){
        traffic[i].update(road.borders, []);
    }
    for(let i = 0; i < cars.length; i++){
        cars[i].update(road.borders,traffic);
    }
    bestCar = cars.find(
        c => c.y==Math.min(
            ...cars.map(c => c.y)
    ));
    canvas.height = window.innerHeight; //clears canvas and has flexibile resize
    networkcanvas.height = window.innerHeight;
    ctx.save();
    ctx.translate(0, -bestCar.y + canvas.height * 0.7);
    road.draw(ctx);
    for(let i=0;i<traffic.length;i++){
        traffic[i].draw(ctx, "red");
    }
    ctx.globalAlpha = 0.2;
    for(let i = 0; i < cars.length; i++){
        cars[i].draw(ctx, "blue");
    }
    ctx.globalAlpha = 1;
    bestCar.draw(ctx, "blue", true);
    ctx.restore();
    NetworkCtx.lineDashOffset = -time/50;
    Visualizer.drawNetwork(NetworkCtx, bestCar.brain);
    requestAnimationFrame(animate)
}