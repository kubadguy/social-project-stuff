<script lang="ts">
    import { onMount } from 'svelte';
    import { isBackendAwake } from '$lib/backend';
    import { base } from '$app/paths';

    let checking = true;
    let awake = false;
    let msg = "";

    let ambient: HTMLAudioElement;

    function playAmbient() {
        ambient = new Audio('/sounds/ambient.mp3');
        ambient.loop = true;
        ambient.volume = 0.25;
        ambient.play().catch(() => {});
    }

    function spawnParticles() {
        const container = document.getElementById("particles");

        for (let i = 0; i < 20; i++) {
            const dot = document.createElement("div");
            dot.className = "particle";
            dot.style.left = Math.random() * window.innerWidth + "px";
            dot.style.animationDelay = Math.random() * 6 + "s";
            container?.appendChild(dot);
        }
    }

    onMount(async () => {
        playAmbient();
        spawnParticles();

        const [status, message] = await isBackendAwake();
        msg = message;
        awake = status === 1;
        checking = false;
    });
</script>

<div class="min-h-screen w-full bg-black text-white flex items-center justify-center p-4 relative overflow-hidden">

    <div id="particles" class="absolute inset-0 -z-10"></div>

    <div class="relative z-10 max-w-2xl w-full text-center backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl">

        {#if checking}
            <h1 class="text-3xl md:text-5xl font-black mb-6">Checking Backend…</h1>

            <!-- Futuristic Loading Bars -->
            <div class="space-y-3 w-3/4 mx-auto">
                <div class="cyber-bar"></div>
                <div class="cyber-bar"></div>
                <div class="cyber-bar"></div>
            </div>

            <p class="mt-4 text-white/70">Calibrating systems…</p>

        {:else if awake}
            <h1 class="text-4xl md:text-6xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-6">
                Backend Online 🎉
            </h1>

            <p class="text-white/70 mb-6">{msg}</p>

            <button class="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 transition shadow-lg shadow-blue-900/50 text-lg font-semibold">
                Start Experience
            </button>

        {:else}
            <h1 class="text-4xl md:text-6xl font-black bg-gradient-to-r from-red-400 to-purple-400 bg-clip-text text-transparent mb-6">
                Backend Sleeping 😴
            </h1>

            <p class="text-white/70 mb-6">{msg}</p>

            <a href="{base}/wakeup"
               class="px-8 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 transition shadow-lg shadow-purple-900/50 text-lg font-semibold">
                Wake Up Backend
            </a>
        {/if}
    </div>
</div>
