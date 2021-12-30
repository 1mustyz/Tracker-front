<script>

</script>

<main>
    <table class="zigzag">
        <thead>
          <tr>
            <th class="header">Player</th>
            <th class="header">Goals</th>
            <th class="header">First</th>
            <th class="header">Latest</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Wayne Rooney</td>
            <td>53</td>
            <td>06 Sep 2003</td>
            <td>27 Jun 2016</td>
          </tr>
          <tr>
            <td>Bobby Charlton</td>
            <td>49</td>
            <td>19 Apr 1958</td>
            <td>20 May 1970</td>
          </tr>
          <tr>
            <td>Gary Lineker</td>
            <td>48</td>
            <td>26 Mar 1985</td>
            <td>29 Apr 1992</td>
          </tr>
          <tr>
            <td>Jimmy Greaves</td>
            <td>44</td>
            <td>17 May 1959</td>
            <td>24 May 1967</td>
          </tr>
          <tr>
            <td>Michael Owen </td>
            <td>40</td>
            <td>27 May 1998</td>
            <td>12 Sep 2007</td>
          </tr>
          <tr>
            <td>Alan Shearer</td>
            <td>30</td>
            <td>19 Feb 1992</td>
            <td>20 Jun 2000</td>
          </tr>
          <tr>
            <td>Tom Finney</td>
            <td>30</td>
            <td>28 Sep 1946</td>
            <td>04 Oct 1958</td>
          </tr>
          <tr>
            <td>Nat Lofthouse</td>
            <td>30</td>
            <td>22 Nov 1950</td>
            <td>22 Oct 1958</td>
          </tr>
          <tr>
            <td>Vivian Woodward</td>
            <td>29</td>
            <td>14 Feb 1903</td>
            <td>13 Mar 1911</td>
          </tr>
          <tr>
            <td>Frank Lampard</td>
            <td>29</td>
            <td>20 Aug 2003</td>
            <td>29 May 2013</td>
          </tr>
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
  
</style>