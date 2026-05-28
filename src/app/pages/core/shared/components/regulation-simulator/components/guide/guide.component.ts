import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Panel } from 'primeng/panel';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { GuideHttpService } from '@/pages/core/roles/external/services';

@Component({
    selector: 'app-guide',
    imports: [Panel, ToggleSwitchModule, ReactiveFormsModule],
    templateUrl: './guide.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GuideComponent implements OnInit {
    private readonly guideHttpService = inject(GuideHttpService);
    items = signal([]);

    ngOnInit() {
        this.findRequirementConfigurations();
    }

    findRequirementConfigurations() {
        this.guideHttpService.findRequirementConfigurations('bdcd37a9-abcc-4060-9cbf-6cfdaad00d5d', 'bachiller').subscribe({
            next: (response) => {
                console.log(response);
            }
        });
    }
}
