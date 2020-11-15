$(document).ready(() => {
  $('#createGameForm').on('submit', (event) => {
    event.preventDefault();

    const players = [
      $('#player1').val(),
      $('#player2').val(),
      $('#player3').val(),
      $('#player4').val()
    ];

    $.ajax({
      url: '/api/games',
      method: 'POST',
      data: { players }
    })
    .then((res) => {
      if (res.success) {
        window.location.href = `/game/${res.data._id}`
      }
    })
  })
});