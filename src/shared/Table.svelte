<script>
    import { vehicleStore,user } from '../stores';
    import router from "page"

    console.log($user.vehicle)

    const vehicleHandler = async (vehicle) => {
      console.log(vehicle)
      vehicleStore.set(vehicle)
      router.redirect('/vehicle-detail')
  }
</script>

<main>
    <table class="zigzag">
        <thead>
          <tr>
            <th class="header">S/N</th>
            <th class="header">VEHICLE NAME</th>
            <th class="header">BRAND</th>
            <th class="header">COLOR</th>
            <th class="header">PURCHASE DATE</th>
            <th class="header">ID</th>
          </tr>
        </thead>
        <tbody>
          {#each $user.vehicle as vehicle, ind}
            <tr class="tr" on:click={()=>vehicleHandler(vehicle)}>
              <td class="td">{ind + 1}</td>
              <td class="td">{vehicle.vehicleName}</td>
              <td class="td">{vehicle.brandName}</td>
              <td class="td">{vehicle.color}</td>
              <td class="td">{vehicle.yearOfPurchase}</td>
              <td class="td">{vehicle.vehicleId}</td>

            </tr>
          {/each}
         
        </tbody>
      </table>
</main>

<style>
main {
  background-color: white;
  padding: 3rem;
  margin-left: 2rem;
  margin-right: 2.3rem;
  border-radius: 10px;
}

table {  
  font-family:sans-serif;
  width: 100%;
}  
  th, td {
    padding: 1em 1em;
    text-align:left;
  }  
    :nth-child(2) {
      text-align:right;
    }
  td {
    background-color:#eee;    
  }
  th {
    background-color:#009;
    color:#fff;
  }

.zigzag {
  border-collapse:separate;
  border-spacing:.25em 1em;
}    
  tbody tr:nth-child(odd) {
    transform:rotate(0.5deg);
  }
  thead tr,
  tbody tr:nth-child(even) {
    transform:rotate(-0.5deg);
  }
  
  .tr:hover{
    transform: scale(1);
    transform: rotate(0deg);
    cursor: pointer;
  }

  .tr:hover *{
    background-color: white;
  }
  
</style>