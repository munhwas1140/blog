"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import styled from "styled-components";
import { useRouter } from "next/navigation";

const Container = styled.div`
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  background-color: #1a1a1a;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BackButton = styled.button`
  position: fixed;
  top: 2rem;
  left: 2rem;
  padding: 0.75rem 1.5rem;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  z-index: 10;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

const HelpTooltip = styled.div`
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.75rem 1.5rem;
  background-color: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  color: white;
  font-size: 1rem;
  text-align: center;
  max-width: 90%;
  backdrop-filter: blur(8px);
  z-index: 10;
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
  animation: fadeInUp 0.5s forwards, fadeOut 0.5s forwards 5s;

  @keyframes fadeInUp {
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }

  @keyframes fadeOut {
    to {
      opacity: 0;
    }
  }
`;

const AxesDisplay = styled.div`
  position: fixed;
  bottom: 20px;
  left: 20px;
  width: 120px;
  height: 120px;
  background-color: rgba(0, 0, 0, 0.3);
  border: none;
  z-index: 10;
  overflow: hidden;
`;

const Canvas = styled.div`
  width: 100%;
  height: 100%;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
`;

export default function ThreeDemoPage() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const axesRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [showHelp, setShowHelp] = useState(true);

  useEffect(() => {
    if (!canvasRef.current || !axesRef.current) return;

    // Three.js 설정
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);

    // 카메라 설정
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(12, 9, 18);
    camera.lookAt(0, 0, 0);

    // 렌더러 설정
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    canvasRef.current.appendChild(renderer.domElement);

    // OrbitControls 추가
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // 부드러운 관성 효과
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.8; // 회전 속도
    controls.minDistance = 10; // 최소 줌 거리
    controls.maxDistance = 30; // 최대 줌 거리
    controls.enablePan = false; // 카메라 패닝 비활성화
    controls.update();

    // 조명 설정
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xffffff, 1, 30);
    pointLight1.position.set(15, 15, 15);
    scene.add(pointLight1);

    // 좌표축 헬퍼를 위한 별도 설정
    const axesScene = new THREE.Scene();
    const axesCamera = new THREE.PerspectiveCamera(50, 1, 0.1, 10);
    axesCamera.position.set(2, 2, 2);
    axesCamera.lookAt(0, 0, 0);

    // 축 헬퍼용 렌더러
    const axesRenderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    axesRenderer.setSize(120, 120);
    axesRenderer.setClearColor(0x000000, 0);
    axesRef.current.appendChild(axesRenderer.domElement);

    // 커스텀 축 생성 (더 짧고 두꺼운 화살표)
    const axesGroup = new THREE.Group();

    // 축 길이와 두께 조정 - 더 짧게 변경
    const axisLength = 0.7;
    const headLength = 0.3; // 화살촉 길이 (전체 길이의 30%)
    const headWidth = 0.1; // 화살촉 너비
    const lineWidth = 0.05; // 선 두께

    // X축 (빨간색) 커스텀 화살표
    const xAxisGeometry = new THREE.CylinderGeometry(
      lineWidth,
      lineWidth,
      axisLength - headLength,
      8
    );
    const xAxisMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const xAxis = new THREE.Mesh(xAxisGeometry, xAxisMaterial);
    xAxis.position.set((axisLength - headLength) / 2, 0, 0);
    xAxis.rotation.z = -Math.PI / 2;
    axesGroup.add(xAxis);

    // X축 화살촉
    const xHeadGeometry = new THREE.ConeGeometry(headWidth, headLength, 8);
    const xHead = new THREE.Mesh(xHeadGeometry, xAxisMaterial);
    xHead.position.set(axisLength - headLength / 2, 0, 0);
    xHead.rotation.z = -Math.PI / 2;
    axesGroup.add(xHead);

    // Y축 (녹색) 커스텀 화살표
    const yAxisGeometry = new THREE.CylinderGeometry(
      lineWidth,
      lineWidth,
      axisLength - headLength,
      8
    );
    const yAxisMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const yAxis = new THREE.Mesh(yAxisGeometry, yAxisMaterial);
    yAxis.position.set(0, (axisLength - headLength) / 2, 0);
    axesGroup.add(yAxis);

    // Y축 화살촉
    const yHeadGeometry = new THREE.ConeGeometry(headWidth, headLength, 8);
    const yHead = new THREE.Mesh(yHeadGeometry, yAxisMaterial);
    yHead.position.set(0, axisLength - headLength / 2, 0);
    axesGroup.add(yHead);

    // Z축 (파란색) 커스텀 화살표
    const zAxisGeometry = new THREE.CylinderGeometry(
      lineWidth,
      lineWidth,
      axisLength - headLength,
      8
    );
    const zAxisMaterial = new THREE.MeshBasicMaterial({ color: 0x0033ff });
    const zAxis = new THREE.Mesh(zAxisGeometry, zAxisMaterial);
    zAxis.position.set(0, 0, (axisLength - headLength) / 2);
    zAxis.rotation.x = Math.PI / 2;
    axesGroup.add(zAxis);

    // Z축 화살촉
    const zHeadGeometry = new THREE.ConeGeometry(headWidth, headLength, 8);
    const zHead = new THREE.Mesh(zHeadGeometry, zAxisMaterial);
    zHead.position.set(0, 0, axisLength - headLength / 2);
    zHead.rotation.x = Math.PI / 2;
    axesGroup.add(zHead);

    axesScene.add(axesGroup);

    // 축 라벨 추가 (더 작게 설정)
    const createLabel = (
      text: string,
      position: THREE.Vector3,
      color: number
    ) => {
      const canvas = document.createElement("canvas");
      canvas.width = 64;
      canvas.height = 64;
      const context = canvas.getContext("2d");

      if (context) {
        context.fillStyle = "rgba(0, 0, 0, 0)";
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.font = "bold 24px Arial";
        context.fillStyle = `#${color.toString(16).padStart(6, "0")}`;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(text, canvas.width / 2, canvas.height / 2);

        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({
          map: texture,
          transparent: true,
        });

        const sprite = new THREE.Sprite(material);
        sprite.position.copy(position);
        sprite.scale.set(0.3, 0.3, 0.3);

        return sprite;
      }

      return null;
    };

    // 축 라벨 추가 (위치 조정)
    const labelX = createLabel(
      "X",
      new THREE.Vector3(axisLength + 0.1, 0, 0),
      0xff0000
    );
    const labelY = createLabel(
      "Y",
      new THREE.Vector3(0, axisLength + 0.1, 0),
      0x00ff00
    );
    const labelZ = createLabel(
      "Z",
      new THREE.Vector3(0, 0, axisLength + 0.1),
      0x0033ff
    );

    if (labelX) axesScene.add(labelX);
    if (labelY) axesScene.add(labelY);
    if (labelZ) axesScene.add(labelZ);

    // 상수 정의
    const CUBE_SIZE = 9;
    const POINT_COLOR_A = 0xff3366; // 첫 번째 점 색상
    const POINT_COLOR_B = 0x33ff66; // 두 번째 점 색상
    const TRAIL_DURATION = 4000; // 선이 유지되는 시간 (밀리초)
    const MOVE_SPEED = 0.015; // 점의 이동 속도 - 원래 속도로 복원
    const TRAIL_SEGMENTS = 3; // 각 프레임마다 생성할 선의 개수
    const CUBE_FLOAT_SPEED = 0.001; // 큐브 움직임 속도
    const CUBE_FLOAT_AMPLITUDE = 0.5; // 큐브 움직임 진폭

    // 정육면체 생성
    const cubeGeometry = new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE);
    const cubeMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide,
      depthWrite: false,
      emissiveIntensity: 1,
    });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    scene.add(cube);

    // 정육면체 모서리 (와이어프레임) 생성
    const edgesGeometry = new THREE.EdgesGeometry(cubeGeometry);
    const edgesMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      opacity: 1,
      transparent: false,
      linewidth: 2.5,
    });
    const wireframe = new THREE.LineSegments(edgesGeometry, edgesMaterial);
    cube.add(wireframe);

    // 정육면체 모서리 좌표 정의
    const cornerPositions = [
      new THREE.Vector3(-CUBE_SIZE / 2, -CUBE_SIZE / 2, CUBE_SIZE / 2), // 앞면
      new THREE.Vector3(CUBE_SIZE / 2, -CUBE_SIZE / 2, CUBE_SIZE / 2),
      new THREE.Vector3(CUBE_SIZE / 2, CUBE_SIZE / 2, CUBE_SIZE / 2),
      new THREE.Vector3(-CUBE_SIZE / 2, CUBE_SIZE / 2, CUBE_SIZE / 2),
      new THREE.Vector3(-CUBE_SIZE / 2, -CUBE_SIZE / 2, -CUBE_SIZE / 2), // 뒷면
      new THREE.Vector3(CUBE_SIZE / 2, -CUBE_SIZE / 2, -CUBE_SIZE / 2),
      new THREE.Vector3(CUBE_SIZE / 2, CUBE_SIZE / 2, -CUBE_SIZE / 2),
      new THREE.Vector3(-CUBE_SIZE / 2, CUBE_SIZE / 2, -CUBE_SIZE / 2),
    ];

    // 모서리 연결 정보 (각 모서리가 연결될 수 있는 다음 모서리들의 인덱스)
    const edgeConnections = [
      [1, 3, 4], // 0번 모서리가 연결될 수 있는 모서리들
      [0, 2, 5], // 1번 모서리가 연결될 수 있는 모서리들
      [1, 3, 6], // 2번 모서리가 연결될 수 있는 모서리들
      [0, 2, 7], // 3번 모서리가 연결될 수 있는 모서리들
      [0, 5, 7], // 4번 모서리가 연결될 수 있는 모서리들
      [1, 4, 6], // 5번 모서리가 연결될 수 있는 모서리들
      [2, 5, 7], // 6번 모서리가 연결될 수 있는 모서리들
      [3, 4, 6], // 7번 모서리가 연결될 수 있는 모서리들
    ];

    // 모서리 엣지 정의 (각 엣지는 두 모서리 인덱스의 쌍)
    const edges = [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0], // 앞면
      [4, 5],
      [5, 6],
      [6, 7],
      [7, 4], // 뒷면
      [0, 4],
      [1, 5],
      [2, 6],
      [3, 7], // 연결 엣지
    ];

    // 두 점 생성
    const pointGeometry = new THREE.SphereGeometry(0.2, 24, 24);
    const pointMaterialA = new THREE.MeshPhongMaterial({
      color: POINT_COLOR_A,
      emissive: POINT_COLOR_A,
      emissiveIntensity: 0.3,
      shininess: 80,
    });
    const pointMaterialB = new THREE.MeshPhongMaterial({
      color: POINT_COLOR_B,
      emissive: POINT_COLOR_B,
      emissiveIntensity: 0.3,
      shininess: 80,
    });

    const pointA = new THREE.Mesh(pointGeometry, pointMaterialA);
    const pointB = new THREE.Mesh(pointGeometry, pointMaterialB);

    // 점 주변에 미묘한 발광 효과를 위한 포인트 라이트 추가
    const pointLightA = new THREE.PointLight(POINT_COLOR_A, 0.8, 2);
    const pointLightB = new THREE.PointLight(POINT_COLOR_B, 0.8, 2);

    pointA.add(pointLightA);
    pointB.add(pointLightB);

    scene.add(pointA);
    scene.add(pointB);

    // 초기 위치 설정
    let currentPositionIndices = [0, 4]; // 각 점의 현재 모서리 인덱스
    let targetPositionIndices = [1, 5]; // 각 점의 목표 모서리 인덱스

    pointA.position.copy(cornerPositions[currentPositionIndices[0]]);
    pointB.position.copy(cornerPositions[currentPositionIndices[1]]);

    let progress = 0; // 0에서 1 사이의 이동 진행도

    // 두 점을 잇는 선들을 저장할 배열
    const trails: {
      line: THREE.Line;
      startTime: number;
    }[] = [];

    // 모서리를 따라 이동하기 위한 경로 찾기 함수
    function findPathAlongEdges(start: number, end: number): number[] {
      // 직접 연결된 경우
      if (isDirectlyConnected(start, end)) return [start, end];

      // 한 번의 중간 경유지를 통해 연결된 경우
      for (const mid of edgeConnections[start]) {
        if (isDirectlyConnected(mid, end)) {
          return [start, mid, end];
        }
      }

      // 두 번의 중간 경유지를 통해 연결된 경우
      for (const mid1 of edgeConnections[start]) {
        for (const mid2 of edgeConnections[end]) {
          if (isDirectlyConnected(mid1, mid2)) {
            return [start, mid1, mid2, end];
          }
        }
      }

      // 경로를 찾지 못한 경우 기본 경로 반환
      return [start, end];
    }

    // 두 모서리가 직접 연결되어 있는지 확인하는 함수
    function isDirectlyConnected(a: number, b: number): boolean {
      return edges.some(
        ([start, end]) =>
          (start === a && end === b) || (start === b && end === a)
      );
    }

    // 현재 경로 저장 배열
    const paths = [
      findPathAlongEdges(currentPositionIndices[0], targetPositionIndices[0]),
      findPathAlongEdges(currentPositionIndices[1], targetPositionIndices[1]),
    ];

    // 애니메이션 ID 저장 변수
    let animationId: number | null = null;

    // 리사이즈 핸들러
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    // 애니메이션 함수
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      const currentTime = performance.now();

      // 정육면체 회전
      cube.rotation.x += 0.002;
      cube.rotation.y += 0.003;

      // 정육면체 움직임 추가 (부드럽게 떠다니는 효과)
      cube.position.y =
        Math.sin(currentTime * CUBE_FLOAT_SPEED) * CUBE_FLOAT_AMPLITUDE;
      cube.position.x =
        Math.cos(currentTime * CUBE_FLOAT_SPEED * 0.7) *
        CUBE_FLOAT_AMPLITUDE *
        0.5;
      cube.position.z =
        Math.sin(currentTime * CUBE_FLOAT_SPEED * 0.5) *
        CUBE_FLOAT_AMPLITUDE *
        0.3;

      // OrbitControls 업데이트
      controls.update();

      // 좌표축 헬퍼 업데이트 - 메인 카메라와 방향 동기화
      axesCamera.position.copy(camera.position).normalize().multiplyScalar(2);
      axesCamera.lookAt(0, 0, 0);
      axesRenderer.render(axesScene, axesCamera);

      // 모서리 위치 업데이트 (큐브의 위치와 회전을 반영)
      updateCornerPositions();

      // 점들의 이동 진행
      progress += MOVE_SPEED;

      // 두 점 사이의 거리 계산
      const distance = pointA.position.distanceTo(pointB.position);
      const normalizedDistance = Math.min(distance / (CUBE_SIZE * 1.2), 1);
      const closenessFactor = 1 - normalizedDistance;

      // 점의 크기와 빛 세기를 거리에 따라 부드럽게 조정
      // 이징 함수를 적용하여 변화가 자연스럽게 보이도록 함
      const eased = easeOutCubic(closenessFactor);

      // 포인트의 스케일 업데이트 (최대 20% 증가)
      const scaleMultiplier = 1 + eased * 0.2;
      pointA.scale.set(scaleMultiplier, scaleMultiplier, scaleMultiplier);
      pointB.scale.set(scaleMultiplier, scaleMultiplier, scaleMultiplier);

      // 포인트 라이트의 강도 업데이트 (자연스러운 변화)
      pointLightA.intensity = 0.8 + eased * 1.5;
      pointLightB.intensity = 0.8 + eased * 1.5;

      // 포인트 라이트의 거리 업데이트
      pointLightA.distance = 2 + eased * 1.5;
      pointLightB.distance = 2 + eased * 1.5;

      if (progress >= 1) {
        // 경로의 끝에 도달했을 때 새로운 경로 설정
        progress = 0;
        currentPositionIndices = targetPositionIndices.slice();

        // 새로운 목표점 선택 (무작위)
        targetPositionIndices = currentPositionIndices.map((currentIdx, i) => {
          const possibleConnections = edgeConnections[currentIdx];
          let nextIdx;
          do {
            nextIdx =
              possibleConnections[
                Math.floor(Math.random() * possibleConnections.length)
              ];
          } while (nextIdx === currentPositionIndices[i]); // 다음 위치가 현재 위치와 같지 않도록
          return nextIdx;
        });

        // 새 경로 계산
        paths[0] = findPathAlongEdges(
          currentPositionIndices[0],
          targetPositionIndices[0]
        );
        paths[1] = findPathAlongEdges(
          currentPositionIndices[1],
          targetPositionIndices[1]
        );
      }

      // 여러 개의 중간 위치를 계산하여 더 촘촘한 선 생성
      for (let i = 0; i < TRAIL_SEGMENTS; i++) {
        // 각 세그먼트에 대한 보간된 위치 계산
        const segmentOffset = (i / TRAIL_SEGMENTS) * MOVE_SPEED;
        const segmentProgress = Math.min(progress + segmentOffset, 1);

        // 임시 위치 객체 생성
        const tempPointA = new THREE.Vector3();
        const tempPointB = new THREE.Vector3();

        // 각 점의 위치 계산
        calculatePointPosition(paths[0], segmentProgress, tempPointA);
        calculatePointPosition(paths[1], segmentProgress, tempPointB);

        // 두 점을 연결하는 선 생성
        const trailGeometry = new THREE.BufferGeometry().setFromPoints([
          tempPointA,
          tempPointB,
        ]);

        const trailMaterial = new THREE.LineBasicMaterial({
          color: 0x0033cc,
          transparent: true,
          opacity: 0.8,
          depthTest: false,
          linewidth: 2,
        });

        const trail = new THREE.Line(trailGeometry, trailMaterial);
        scene.add(trail);

        // 선 저장
        trails.push({
          line: trail,
          startTime: currentTime,
        });
      }

      // 실제 점들의 위치 업데이트
      updatePointPosition(pointA, paths[0], progress);
      updatePointPosition(pointB, paths[1], progress);

      // 오래된 선 제거
      for (let i = trails.length - 1; i >= 0; i--) {
        const age = currentTime - trails[i].startTime;
        if (age > TRAIL_DURATION) {
          scene.remove(trails[i].line);
          trails[i].line.geometry.dispose();
          (trails[i].line.material as THREE.Material).dispose();
          trails.splice(i, 1);
        } else {
          // 시간에 따라 투명도와 색상 점진적으로 변경
          const fadeRatio = age / TRAIL_DURATION;
          const opacity = 0.8 * (1 - fadeRatio);

          // 선 색상을 시간에 따라 서서히 회색으로 변경
          const material = trails[i].line.material as THREE.LineBasicMaterial;
          material.opacity = opacity;

          // 원래 색상에서 회색으로 점진적으로 변경
          const fadeColor = new THREE.Color();
          fadeColor.lerpColors(
            new THREE.Color(0x0033cc), // 파란색에서 시작
            new THREE.Color(0x333333), // 최종 색상 (어두운 회색)
            fadeRatio
          );

          material.color = fadeColor;
        }
      }

      // 메인 씬 렌더링
      renderer.render(scene, camera);
    };

    // 점의 위치를 경로를 따라 업데이트하는 함수
    function updatePointPosition(
      point: THREE.Mesh,
      path: number[],
      progress: number
    ) {
      if (path.length === 2) {
        // 직접 연결된 경우 (한 번에 이동)
        point.position.lerpVectors(
          cornerPositions[path[0]],
          cornerPositions[path[1]],
          progress
        );
      } else if (path.length === 3) {
        // 중간 경유지가 있는 경우 (두 번에 나눠 이동)
        if (progress < 0.5) {
          // 첫 번째 구간
          point.position.lerpVectors(
            cornerPositions[path[0]],
            cornerPositions[path[1]],
            progress * 2
          );
        } else {
          // 두 번째 구간
          point.position.lerpVectors(
            cornerPositions[path[1]],
            cornerPositions[path[2]],
            (progress - 0.5) * 2
          );
        }
      } else if (path.length === 4) {
        // 두 개의 중간 경유지가 있는 경우 (세 번에 나눠 이동)
        if (progress < 0.33) {
          point.position.lerpVectors(
            cornerPositions[path[0]],
            cornerPositions[path[1]],
            progress * 3
          );
        } else if (progress < 0.66) {
          point.position.lerpVectors(
            cornerPositions[path[1]],
            cornerPositions[path[2]],
            (progress - 0.33) * 3
          );
        } else {
          point.position.lerpVectors(
            cornerPositions[path[2]],
            cornerPositions[path[3]],
            (progress - 0.66) * 3
          );
        }
      }
    }

    // Vector3에 점의 위치를 계산하는 함수 (updatePointPosition의 변형)
    function calculatePointPosition(
      path: number[],
      progress: number,
      target: THREE.Vector3
    ) {
      if (path.length === 2) {
        // 직접 연결된 경우 (한 번에 이동)
        target.lerpVectors(
          cornerPositions[path[0]],
          cornerPositions[path[1]],
          progress
        );
      } else if (path.length === 3) {
        // 중간 경유지가 있는 경우 (두 번에 나눠 이동)
        if (progress < 0.5) {
          // 첫 번째 구간
          target.lerpVectors(
            cornerPositions[path[0]],
            cornerPositions[path[1]],
            progress * 2
          );
        } else {
          // 두 번째 구간
          target.lerpVectors(
            cornerPositions[path[1]],
            cornerPositions[path[2]],
            (progress - 0.5) * 2
          );
        }
      } else if (path.length === 4) {
        // 두 개의 중간 경유지가 있는 경우 (세 번에 나눠 이동)
        if (progress < 0.33) {
          target.lerpVectors(
            cornerPositions[path[0]],
            cornerPositions[path[1]],
            progress * 3
          );
        } else if (progress < 0.66) {
          target.lerpVectors(
            cornerPositions[path[1]],
            cornerPositions[path[2]],
            (progress - 0.33) * 3
          );
        } else {
          target.lerpVectors(
            cornerPositions[path[2]],
            cornerPositions[path[3]],
            (progress - 0.66) * 3
          );
        }
      }
    }

    // 모서리 위치를 큐브의 현재 위치/회전에 맞게 업데이트
    function updateCornerPositions() {
      // 원래 모서리 위치 (큐브 중심이 원점에 있을 때)
      const originalCorners = [
        new THREE.Vector3(-CUBE_SIZE / 2, -CUBE_SIZE / 2, CUBE_SIZE / 2), // 앞면
        new THREE.Vector3(CUBE_SIZE / 2, -CUBE_SIZE / 2, CUBE_SIZE / 2),
        new THREE.Vector3(CUBE_SIZE / 2, CUBE_SIZE / 2, CUBE_SIZE / 2),
        new THREE.Vector3(-CUBE_SIZE / 2, CUBE_SIZE / 2, CUBE_SIZE / 2),
        new THREE.Vector3(-CUBE_SIZE / 2, -CUBE_SIZE / 2, -CUBE_SIZE / 2), // 뒷면
        new THREE.Vector3(CUBE_SIZE / 2, -CUBE_SIZE / 2, -CUBE_SIZE / 2),
        new THREE.Vector3(CUBE_SIZE / 2, CUBE_SIZE / 2, -CUBE_SIZE / 2),
        new THREE.Vector3(-CUBE_SIZE / 2, CUBE_SIZE / 2, -CUBE_SIZE / 2),
      ];

      // 각 원래 모서리 위치에 큐브의 회전과 위치를 적용
      for (let i = 0; i < 8; i++) {
        // 복제하여 원본 데이터 보존
        const corner = originalCorners[i].clone();

        // 큐브 회전 적용
        corner.applyEuler(cube.rotation);

        // 큐브 위치 적용
        corner.add(cube.position);

        // 업데이트된 위치 저장
        cornerPositions[i].copy(corner);
      }
    }

    // 부드러운 효과를 위한 이징 함수
    function easeOutCubic(x: number): number {
      return 1 - Math.pow(1 - x, 3);
    }

    // 애니메이션 시작
    animate();

    // 10초 후에 도움말 숨기기
    const timeoutId = setTimeout(() => {
      setShowHelp(false);
    }, 10000);

    // 정리 함수
    return () => {
      // 애니메이션 정지
      if (animationId) {
        cancelAnimationFrame(animationId);
      }

      window.removeEventListener("resize", handleResize);

      // Controls 정리
      controls.dispose();

      // 축 헬퍼 정리
      axesRenderer.dispose();

      // 커스텀 축 지오메트리 정리
      xAxisGeometry.dispose();
      yAxisGeometry.dispose();
      zAxisGeometry.dispose();
      xHeadGeometry.dispose();
      yHeadGeometry.dispose();
      zHeadGeometry.dispose();
      xAxisMaterial.dispose();
      yAxisMaterial.dispose();
      zAxisMaterial.dispose();

      if (axesRef.current?.firstChild) {
        axesRef.current.removeChild(axesRef.current.firstChild);
      }

      // 씬에서 객체 제거
      scene.remove(cube);
      scene.remove(pointA);
      scene.remove(pointB);

      // 선 제거
      trails.forEach((trail) => {
        scene.remove(trail.line);
        trail.line.geometry.dispose();
        (trail.line.material as THREE.Material).dispose();
      });

      // 지오메트리 & 머티리얼 정리
      cubeGeometry.dispose();
      cubeMaterial.dispose();
      edgesGeometry.dispose();
      edgesMaterial.dispose();
      pointGeometry.dispose();
      pointMaterialA.dispose();
      pointMaterialB.dispose();

      // 렌더러 정리
      renderer.dispose();

      // DOM에서 캔버스 제거
      if (
        canvasRef.current &&
        canvasRef.current.contains(renderer.domElement)
      ) {
        canvasRef.current.removeChild(renderer.domElement);
      }

      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <Container>
      <BackButton onClick={() => router.back()}>← 뒤로가기</BackButton>
      <Canvas ref={canvasRef} />
      {showHelp && (
        <HelpTooltip>
          <p>마우스를 드래그하여 회전</p>
          <p>마우스 휠로 확대/축소</p>
        </HelpTooltip>
      )}
      <AxesDisplay ref={axesRef} />
    </Container>
  );
}
