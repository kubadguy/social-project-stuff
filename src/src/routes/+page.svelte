<script lang="ts">
    import { onMount } from 'svelte';
    import { isBackendAwake } from '$lib/backend';
    import { base } from '$app/paths';
    import { onDestroy } from 'svelte';

    const w = window.innerWidth;
    const h = window.innerHeight;

    let checking = true;
    let msg = '';

    let ambient: HTMLAudioElement | null = null;

    function playAmbient() {
        ambient = new Audio(`${base}/sounds/ambient.mp3`);
        ambient.loop = true;
        ambient.volume = 0.25;
        ambient.play().catch(() => {});
    }

    function spawnParticles() {
        const container = document.getElementById('particles');
        if (!container) return;

        for (let i = 0; i < 50; i++) {
            const dot = document.createElement('div');
            dot.className = 'particle';
            dot.style.left = Math.random() * w + 'px';
            dot.style.top = Math.random() * h + 'px';
            dot.style.animationDelay = Math.random() * 5 + 's';
            container.appendChild(dot);
        }
    }

    function spawnFloatingLines() {
        const container = document.getElementById('lines');
        if (!container) return;

        for (let i = 0; i < 20; i++) {
            const line = document.createElement('div');
            line.className = 'floating-line';
            line.style.left = Math.random() * w + 'px';
            line.style.animationDelay = Math.random() * 5 + 's';
            container.appendChild(line);
        }
    }

    onMount(async () => {
        playAmbient();
        spawnParticles();
        spawnFloatingLines();

        const [status, message] = await isBackendAwake();
        msg = message;
        checking = false; // Set to false once the final status is received
    });

    onDestroy(() => {
        ambient?.pause();
        ambient = null;
    });

    // Helper to determine if the backend is successfully online
    $: backendOnline = msg === "Backend Online 🎉";
</script>

<div class="min-h-screen w-full bg-black text-white flex items-center justify-center p-4 relative overflow-hidden font-sans">
    <div id="particles" class="absolute inset-0 -z-20"></div>
    <div id="lines" class="absolute inset-0 -z-10"></div>

    <div class="relative z-10 max-w-2xl w-full text-center backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl animate-fadein">

        {#if checking}
            <h1 class="text-3xl md:text-5xl font-black mb-6 neon-glitch">
                Checking Backend…
            </h1>

            <div class="space-y-3 w-3/4 mx-auto">
                <div class="cyber-bar"></div>
                <div class="cyber-bar"></div>
                <div class="cyber-bar"></div>
                <div class="cyber-bar"></div>
                <div class="cyber-bar"></div>
            </div>

            <p class="mt-4 text-white/70 tracking-wider">Calibrating systems…</p>

        {:else}
            <h1
                    class="text-4xl md:text-6xl font-black bg-gradient-to-r {backendOnline ? 'from-blue-400 to-purple-400' : 'from-red-400 to-purple-400'} bg-clip-text text-transparent mb-6 glitch-text"
                    data-text={msg}>
                {msg}
            </h1>

            <p class="text-white/70 mb-6 tracking-wider">
                {#if backendOnline}
                    {msg}
                {:else}
                    Backend is not available. Please try again later or check the server status.
                {/if}
            </p>

            {#if backendOnline}
                <button class="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 transition shadow-lg shadow-blue-900/50 text-lg font-semibold glow-button">
                    Start Experience
                </button>
            {/if}
        {/if}
    </div>
</div>

<style>
    /* =========================
       GLOBAL DYNAMIC ELEMENTS
       ========================= */
    :global(.particle) {
        position: absolute;
        width: 6px;
        height: 6px;
        background: linear-gradient(45deg, #ff00ff, #00ffff);
        border-radius: 50%;
        opacity: 0.7;
        animation: float 6s ease-in-out infinite;
    }

    :global(.floating-line) {
        position: absolute;
        width: 2px;
        height: 80px;
        background: linear-gradient(180deg, #00ffff, #ff00ff);
        opacity: 0.4;
        animation: floatLine 6s linear infinite;
    }

    @keyframes float {
        0%, 100% { transform: translateY(0) scale(1); opacity: .7; }
        50% { transform: translateY(-30px) scale(1.5); opacity: .4; }
    }

    @keyframes floatLine {
        0% { transform: translateY(0) rotate(0deg); opacity: .4; }
        50% { transform: translateY(-200px) rotate(180deg); opacity: .1; }
        100% { transform: translateY(0) rotate(360deg); opacity: .4; }
    }

    /* Cyber bars */
    .cyber-bar {
        height: 6px;
        background: linear-gradient(90deg, #ff00ff, #00ffff);
        animation: loading 1.5s infinite;
        border-radius: 3px;
    }

    @keyframes loading {
        0%, 100% { transform: scaleX(0.2); }
        50% { transform: scaleX(1); }
    }

    /* Glitch text */
    .glitch-text {
        position: relative;
    }

    .glitch-text::before,
    .glitch-text::after {
        content: attr(data-text);
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
    }

    .glitch-text::before {
        color: #00ffff;
        animation: glitchTop 2s infinite linear alternate-reverse;
    }

    .glitch-text::after {
        color: #ff00ff;
        animation: glitchBottom 2s infinite linear alternate-reverse;
    }

    @keyframes glitchTop {
        0% { clip: rect(0, 9999px, 0, 0); transform: translate(-2px, -2px); }
        50% { clip: rect(0, 9999px, 100%, 0); transform: translate(2px, 2px); }
        100% { clip: rect(0, 9999px, 0, 0); transform: translate(-2px, -2px); }
    }

    @keyframes glitchBottom {
        0% { clip: rect(0, 9999px, 0, 0); transform: translate(2px, 2px); }
        50% { clip: rect(0, 9999px, 100%, 0); transform: translate(-2px, -2px); }
        100% { clip: rect(0, 9999px, 0, 0); transform: translate(2px, 2px); }
    }

    /* Buttons */
    .glow-button {
        box-shadow: 0 0 10px #ff00ff, 0 0 20px #00ffff, 0 0 30px #ff00ff;
        transition: all .3s ease-in-out;
    }

    .glow-button:hover {
        box-shadow: 0 0 20px #ff00ff, 0 0 40px #00ffff, 0 0 60px #ff00ff;
        transform: scale(1.05);
    }

    @keyframes fadein {
        0% { opacity: 0; }
        100% { opacity: 1; }
    }

    .animate-fadein {
        animation: fadein 1s ease-in-out;
    }
</style>
