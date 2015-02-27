@inherits Umbraco.Web.Mvc.UmbracoTemplatePage
@{
    Layout = "Master.cshtml";

	var allArticles = CurrentPage.Children().OrderBy("CreateDate desc");
	var paging = Paging.GetPages(allArticles.Count(), 12); 	@* Updating items per page need to update portfolioPage settings too *@
	var selectedArticles = allArticles.Skip(paging.Skip).Take(paging.Take).ToList();
}

@{ Html.RenderPartial("portfolio-filter"); }	

<div class="stats">
<p>Counts</p>
<p>Tile count: <span class="tileCount" style="color: yellow;">0</span></p>
<p>Active tile: <span class="activeTile" style="color: yellow;">0</span></p>
<p>Active row: <span class="activeRow" style="color: yellow;">0</span></p>
<p>Tile row: <span class="tileRow" style="color: yellow;">0</span></p>
<p>Insert after: <span class="insertAfter" style="color: yellow;">0</span></p>
<p>Active: <span class="activeBlock" style="color: red;">false</span></p>
<p>Children: <span class="children" style="color: grey;">0</span></p>
<p>Total pages: <span class="pages">0</span></>
<p>Current page: <span class="currentPage">0</span></>
<p>Next page: <span class="nextPage">0</span></>
<p>Prev page: <span class="prevPage">0</span></>
</div>
	
	



<div id="portfolio-tiles" class="clearfix">
	@foreach( var element in selectedArticles ) {
		<a href="@element.Url" class="portfolio-tile">
			@if(element.HasValue("tileImage")){
				<img src="@Umbraco.Media(element.tileImage.ToString()).Url?width=600&height=400&mode=crop" alt="@element.Name"/>
			} else {
				<img src="http://placehold.it/600x400&text=@element.Name" alt="@element.Name"/>
			}
			
		</a>
	
	}
</div>


@PagingTemplate.RenderPaging(paging, CurrentPage.Id)



/////////////////


@inherits Umbraco.Web.Mvc.UmbracoTemplatePage
@{

	var allArticles = CurrentPage.Children().OrderBy("CreateDate desc");
	var paging = Paging.GetPages(allArticles.Count(), 4); @* Updating items per page need to update Portfolio Folder settings too *@
	var selectedArticles = allArticles.Skip(paging.Skip).Take(paging.Take).ToList();
}

@foreach( var element in selectedArticles ) {
	<a href="@element.Url" class="portfolio-tile">
		@if(element.HasValue("tileImage")){
			<img src="@Umbraco.Media(element.tileImage.ToString()).Url?width=600&height=400&mode=crop" alt="@element.Name"/>
		} else {
			<img src="http://placehold.it/600x400&text=@element.Name" alt="@element.Name"/>
		}
	</a>
}

