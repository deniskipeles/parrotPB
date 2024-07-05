<script>
  import { onMount } from "svelte";
  import { pb } from "$lib/pocketbase";
  import { goto } from '$app/navigation';
  import { writable } from "svelte/store";
  import { page } from '$app/stores';
  
  let isLoading = false;
	const authData1 = {
    authProviders: [{
        name: "github",
        displayName: "GitHub",
        state: "u2AEZvgHLVadBgK95KhvVdXeIAwLj1",
        authUrl: "",
        codeVerifier: "BxLXvsoAQAau4iY3iQMgLHO4VYKkuFZg4AvZAHSN7h8",
        codeChallenge: "1bu9pxli5UTeK2UDyZKpX4-SxvIDjNZTceAnRgSZ5p8",
        codeChallengeMethod: "S256"
      },
    ],
    usernamePassword: true,
    emailPassword: true,
    onlyVerified: false
  };

  export let auth_collection
  export let display_sign = "Login"
  async function handleOAuthLogin(provider) {
    isLoading = true;
    // Simulate login process
    try{
      const authData = await pb.collection(auth_collection).authWithOAuth2({ provider: provider?.name });
      if(authData.token){
        isLoading=false;
        const redirect_to = $page.url.searchParams.get('redirect_to') ?? $page.url.searchParams.get('redirect') ?? "/";
        goto(redirect_to,{invalidateAll:true})
      }else{
        isLoading=false;
      }
    }catch(e){
      console.log(e)
      isLoading=false
    }
  }
  const authData = writable({});
  onMount(async()=>{
    const authDataResult = await pb.collection(auth_collection).listAuthMethods();
    
    authData.set(authDataResult)
  })
</script>

<!-- Define the component structure -->
<div class="bg-white border border-black p-4 rounded">
  <h2 class="text-lg font-bold mb-4">{display_sign} with:</h2>
  <div class="mb-4">
    {#each $authData?.authProviders ?? [] as provider}
    <button type="button" class="bg-white border border-black text-black font-bold py-2 px-4 rounded mr-2 mb-2" on:click={() => handleOAuthLogin(provider)}>
      {provider.displayName}
    </button>
    {/each}
  </div>
      


  {#if isLoading}
  <div class="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
    <div class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
  </div>
  {/if}
</div>
