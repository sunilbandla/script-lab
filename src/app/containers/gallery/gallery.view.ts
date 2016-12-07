import { Component, ApplicationRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Theme } from '../../helpers';
import { UI, Snippet } from '../../actions';
import { Storage } from '@microsoft/office-js-helpers';
import { Disposable } from '../../services';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../reducers';
import * as _ from 'lodash';
import './gallery.view.scss';

@Component({
    selector: 'gallery-view',
    templateUrl: 'gallery.view.html'
})
export class GalleryView extends Disposable {
    templatesView: boolean;
    snippets$: Observable<ISnippet[]>;
    templates$: Observable<ITemplate[]>;

    constructor(private _store: Store<fromRoot.State>) {
        super();

        this.snippets$ = this._store.select(fromRoot.getSnippets)
            .map(snippets => {
                if (_.isEmpty(snippets)) {
                    this._store.dispatch(new UI.OpenMenuAction());
                    this.templatesView = true;
                }
                return snippets;
            });

        this.templates$ = this._store.select(fromRoot.getTemplates);

        this._store.dispatch(new Snippet.LoadSnippets());
        this._store.dispatch(new Snippet.LoadTemplates());
    }

    // async ngOnInit() {
    //     this.snippets = this._snippetStore.local();
    //     this.templates = await this._snippetStore.templates();
    //     let subscription = this._notification.on<ISnippet>('StorageEvent')
    //         .debounceTime(400)
    //         .subscribe(items => {
    //             this.snippets = this._snippetStore.local();
    //         });

    //     this.markDispose(subscription);
    // }

    // async delete(snippet: ISnippet) {
    //     let result = await this._notification.showDialog('Are you sure you want to delete your snippet?', `Delete '${snippet.name}'`, 'Delete', 'Keep')
    //     if (result === 'Keep') {
    //         throw 'Keep data';
    //     }
    //     if (this._store.get('LastOpened') === snippet.id) {
    //         return this._store.remove('LastOpened');
    //     }

    //     await this._snippetStore.delete(snippet);
    //     this._events.emit('GalleryEvents', GalleryEvents.DELETE, snippet);
    // }

    // async deleteAll() {
    //     let result = await this._notification.showDialog('Are you sure you want to delete all your local snippets?', 'Delete All', 'Delete all', 'Keep them');
    //     if (result === 'Keep them') {
    //         return;
    //     }

    //     await this._snippetStore.deleteAll();
    //     this._store.remove('LastOpened');
    //     this._events.emit('GalleryEvents', GalleryEvents.DELETE_ALL, null);
    // }

    // toggleWarn() {
    //     this.hideWarn = !this.hideWarn;
    //     this._store.insert('LocalStorageWarn', this.hideWarn as any);
    // }

    new() {
        this._store.dispatch(new Snippet.ImportAction('default'));
    }

    // copy(snippet: ISnippet) {
    //     this._events.emit('GalleryEvents', GalleryEvents.COPY, snippet);
    // }

    // select(snippet: ISnippet) {
    //     this._events.emit('GalleryEvents', GalleryEvents.SELECT, snippet);
    // }

    import(item?: ITemplate) {
        if (item == null) {
            // show the Import UI Here
        }
        else {
            this._store.dispatch(new Snippet.ImportAction(item.id || item.gist));
        }
    }

    // commandEvents($event: any) {
    //     if ($event.title === 'Local') {
    //         switch ($event.action) {
    //             case 'Info': return Promise.resolve(this.toggleWarn());
    //             case 'Delete': return this.deleteAll();
    //         }
    //     }
    // }
}