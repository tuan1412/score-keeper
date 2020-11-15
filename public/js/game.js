let globalData = {
  players: [],
  scores: [[]]
};

const changeScore = (event) => {
  const $thisEl = $(event.target);
  const row = $thisEl.data('row');
  const col = $thisEl.data('col');
  const value = $thisEl.val();

  globalData.scores[row][col] = value;

  let sumRound = 0;
  Array.from($(`td input[data-row=${row}]`)).forEach(function (el) {
    const val = parseInt($(el).val()) || 0
    sumRound += val;
  });

  $(`th[data-row=${row}] span`).html(sumRound);

  // render sum col
  let sumCol = 0;
  Array.from($(`td input[data-col=${col}]`)).forEach(function (el) {
    const val = parseInt($(el).val()) || 0
    sumCol += val;
  });
  $(`th[data-col=${col}]`).html(sumCol);

  let sumTotal = 0;
  Array.from($(`.sumHeader`)).forEach(function (el) {
    const val = parseInt($(el).html()) || 0
    sumTotal += val;
  });
  $(`#total span`).html(sumTotal);

}

const renderTable = (data) => {
  globalData = data;
  const { players, scores } = data;
  // render header
  $('#scoreTable thead').html('');
  $('#scoreTable thead').append(`
      <tr>
        <th scope="col">#</th>
        <th scope="col">${players[0]}</th>
        <th scope="col">${players[1]}</th>
        <th scope="col">${players[2]}</th>
        <th scope="col">${players[3]}</th>
      </tr>
    `)

  // render sum of scores
  const [rowScore, totalScore, rowScores] = scores.reduce((total, round) => {
    const [preRowScore, preTotalScore, rowScores] = total;

    const rowScore = [
      preRowScore[0] + round[0],
      preRowScore[1] + round[1],
      preRowScore[2] + round[2],
      preRowScore[3] + round[3],
    ];

    const totalScore = preTotalScore + round[0] + round[1] + round[2] + round[3];

    rowScores.push(round[0] + round[1] + round[2] + round[3]);

    return [rowScore, totalScore, rowScores];
  }, [[0, 0, 0, 0], 0, []]);



  $('#scoreTable thead').append(`
    <tr>
      <th id="total" scope="col">Total (<span>${totalScore}</span>)</th>
      <th class="sumHeader" scope="col" data-col="0">${rowScore[0]}</th>
      <th class="sumHeader" scope="col" data-col="1">${rowScore[1]}</th>
      <th class="sumHeader" scope="col" data-col="2">${rowScore[2]}</th>
      <th class="sumHeader" scope="col" data-col="3">${rowScore[3]}</th>
    </tr>
  `)

  // render scores
  let rounds = '';
  for (let idx = scores.length - 1; idx >=0; idx--) {
    const round = scores[idx];
    const roundHtml = `
      <tr>
        <th data-row="${idx}">Round ${idx + 1} (<span>${rowScores[idx]}</span>)</th>
        <td><input class="form-control" type="number" value="${round[0]}" data-row="${idx}" data-col="0" oninput="changeScore(event)"</td>
        <td><input class="form-control"type="number" value="${round[1]}" data-row="${idx}" data-col="1" oninput="changeScore(event)"</td>
        <td><input class="form-control"type="number" value="${round[2]}" data-row="${idx}" data-col="2" oninput="changeScore(event)"</td>
        <td><input class="form-control"type="number" value="${round[3]}" data-row="${idx}" data-col="3" oninput="changeScore(event)"</td>
      </tr>
    `;
    rounds += roundHtml;
  }


  $('#scoreTable tbody').html('');
  $('#scoreTable tbody').append(rounds);
}

const idGame = window.location.pathname.split('/').pop();
$.ajax({
  url: `/api/games/${idGame}`,
  method: 'GET'
}).then(res => {
  if (res.success) {
    renderTable(res.data);
  }
});

$('#saveScore').on('click', () => {
  $.ajax({
    url: `/api/games/${idGame}`,
    method: 'PUT',
    data: {
      scores: globalData.scores
    }
  }).then(res => {
    if (res.success) {
      $('#alert').append(`
      <div class="alert alert-success alert-dismissible fade show" role="alert">
        <strong>Success!</strong> Lưu bảng điểm thành công.
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>`
    )}
  });
});

$('#addRound').on('click', () => {
  const newRound = globalData.scores.length;

  globalData.scores.push([0, 0, 0, 0]);

  const newRoundHtml = `
    <tr>
      <th data-row="${newRound}">Round ${newRound + 1} (<span>0</span>)</th>
      <td><input class="form-control" type="number" value="0" data-row="${newRound}" data-col="0" oninput="changeScore(event)"</td>
      <td><input class="form-control"type="number" value="0" data-row="${newRound}" data-col="1" oninput="changeScore(event)"</td>
      <td><input class="form-control"type="number" value="0" data-row="${newRound}" data-col="2" oninput="changeScore(event)"</td>
      <td><input class="form-control"type="number" value="0" data-row="${newRound}" data-col="3" oninput="changeScore(event)"</td>
    </tr>
  `

  $('#scoreTable tbody').prepend(newRoundHtml);
});

