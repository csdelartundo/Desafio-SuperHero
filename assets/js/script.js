$(function () {
    const SUPERHERO_API_URL = "https://superheroapi.com/api.php/4905856019427443/";

    $("#encuentraBtn").click(function () {
        let ingresoNumSuperHero = $("#entradaNumero").val();

        if (numeroEnteroPositivo(ingresoNumSuperHero)) {
            encuentraSuperHero(ingresoNumSuperHero);
        } else {
            $("#resultado").html('<div class="alert alert-danger" role="alert">Por favor, ingresa un número nuevamente.</div>');
            $("#chartContainer").html("");
        }
    });

    function numeroEnteroPositivo(valor) {
        let numEnteroPositivo = /^\d{1,3}$/;
        return numEnteroPositivo.test(valor) && valor >= 1 && valor <= 731;
    }

    function encuentraSuperHero(ingresoNumSuperHero) {
        $.ajax({
            url: SUPERHERO_API_URL + ingresoNumSuperHero,
            method: "GET",
            dataType: "json",
            success: function (data) {
                if (data) {
                    $("#resultado").html(`
                        <div class="container">
                            <div class="row">
                                <div class="col-md-4">
                                    <div class="card mb-3 style="height: 370px; width: 100%;"">
                                        <img src="${data.image.url}" class="img-fluid img-card" alt="${data.name}">
                                        <h4>Tu SuperHero es: <span class="card-title">${data.name}</span></h4>
                                    </div>
                                </div>
                                <div class="col-md-8">
                                    <div class="card mb-3">
                                        <div class="card-body">
                                            
                                            <p class="card-text text-center"><strong>Conexiones:</strong> ${data.connections["group-affiliation"]}</p>
                                            <ul class="list-group mb-3">
                                                <li class="list-group-item text-left"><strong>Publicado por:</strong> ${data.biography.publisher}</li>
                                                <li class="list-group-item text-left"><strong>Ocupación:</strong> ${data.work.occupation}</li>
                                                <li class="list-group-item text-left"><strong>Primera aparición:</strong> ${data.biography["first-appearance"]}</li>
                                                <li class="list-group-item text-left"><strong>Altura:</strong> ${data.appearance.height.join(" - ")}</li>
                                                <li class="list-group-item text-left"><strong>Peso:</strong> ${data.appearance.weight.join(" - ")}</li>
                                                <li class="list-group-item text-left"><strong>Alianzas:</strong> ${data.biography.aliases.join(", ")}</li>
                                            </ul>
                                            <div id="chartContainer" style="height: 370px; width: 100%;"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `);
                    mostrarGrafico(data.powerstats);
                } else {
                    $("#resultado").html(
                        '<div class="alert alert-warning" role="alert">Superhéroe no encontrado.</div>'
                    );
                }
            },
            error: function () {
                $("#resultado").html(
                    '<div class="alert alert-danger" role="alert">Error al consultar la API.</div>'
                );
            },
        });
    }

    function mostrarGrafico(powerstats) {
        var dataSuperHero = [];
        for (var key in powerstats) {
            dataSuperHero.push({ label: key, y: parseInt(powerstats[key]), leyendText: key });
        }

        var chart = new CanvasJS.Chart("chartContainer", {
            animationEnabled: true,
            theme: "light2",
            title: {
                text: "Estadísticas de Poder",
            },
            data: [
                {
                    type: "pie",
                    showInLegend: true,
                    legendText: "{label}",
                    indexLabel: "{label} - {y}%",
                    dataPoints: dataSuperHero,
                },
            ],
        });

        chart.render();
    }
});
