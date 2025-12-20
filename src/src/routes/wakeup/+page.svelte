<script lang="ts">
    import { onMount } from 'svelte';
    import { BACKEND_URL } from '$lib/config';
    import { isBackendAwake } from '$lib/backend';

    let status = "Waking backend…";
    let wakeSound: HTMLAudioElement;
    let ambient: HTMLAudioElement;

    function sounds() {
        wakeSound = new Audio('/sounds/wake.mp3');
        wakeSound.volume = 0.7;
        wakeSound.play().catch(() => {});

        ambient = new Audio('/sounds/ambient.mp3');
        ambient.loop = true;
        ambient.volume = 0.25;
        ambient.play().catch(() => {});
    }

    function spawnParticles() {
        const container = document.getElementById("particles");
        for (let i = 0; i < 25; i++) {
            const dot = document.createElement("div");
            dot.className = "particle";
            dot.style.left = Math.random() * window.innerWidth + "px";
            dot.style.animationDelay = Math.random() * 6 + "s";
            container?.appendChild(dot);
        }
    }

    async function wakeBackend() {
        sounds();
        spawnParticles();

        try {
            await fetch(`${BACKEND_URL}/cont/wake-up/`, { cache: 'no-store' });

            for (let i = 0; i < 10; i++) {
                status = `Booting modules… ${i + 1}/10`;
                await new Promise(r => setTimeout(r, 1200));

                const [alive] = await isBackendAwake();
                if (alive === 1) {
                    status = "Backend Online ✔ Redirecting…";
                    await new Promise(r => setTimeout(r, 800));
                    window.location.href = "/";
                    return;
                }
            }

            status = "Backend failed to wake. Try again.";

        } catch {
            status = "Connection failed.";
        }
    }

    onMount(wakeBackend);
</script>

<div class="min-h-screen w-full bg-black text-white flex items-center justify-center p-4 relative overflow-hidden">

    <div id="particles" class="absolute inset-0 -z-10"></div>

    <div class="relative z-10 text-center backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl max-w-xl w-full">

        <h1 class="text-4xl md:text-5xl font-black mb-6">
            Initializing Backend Systems…
        </h1>

        <div class="space-y-3 w-3/4 mx-auto">
            <div class="cyber-bar"></div>
            <div class="cyber-bar"></div>
            <div class="cyber-bar"></div>
            <div class="cyber-bar"></div>
        </div>

        <p class="text-white/80 text-lg mt-6">{status}</p>
    </div>
</div>
