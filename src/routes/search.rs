use askama_axum::{IntoResponse, Response};
use axum::{extract::State, Json};
use serde::Serialize;

use crate::{pages::{self, Search}, AppState};

pub(crate) async fn search() -> Search<'static> {
    Search::new()
}

#[derive(Serialize)]
struct SearchResponse {
    pastes: Vec<SearchPaste>,
}

#[derive(Serialize)]
struct SearchPaste {
    id: String,
    title: String,
    content: String,
}

pub(crate) async fn search_data(
    State(state): State<AppState>,
) -> Result<Response, pages::ErrorResponse<'static>> {
    let data = state.db.all().await?;

    let json = SearchResponse {
        pastes: data.into_iter().map(|(id, x)| SearchPaste { id: id.to_string(), title: x.title.clone().unwrap_or_default(), content: x.text }).collect()
    };

    Ok(Json(json).into_response())
}
